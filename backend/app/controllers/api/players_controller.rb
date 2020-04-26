class Api::PlayersController < Api::ConversationsController
  include Api::MessagesHelper
  before_action :set_player, :except => [:create]

  def index
    if @player
      render json: @player.conversation.players
      return
    end
    render json: {}, status: 401
  end

  def create
    player = Api::Player.find_by(:user_id => session[:user_id])
    if !player
      conversation = Api::Conversation.find(params[:conversation_id])
      if conversation.players_joined < conversation.total_players
        user = Api::User.find(session[:user_id])
        player = Api::Player.new({ :conversation_id => conversation.id, :user_id => session[:user_id], :name => "#{user.first_name} #{user.last_name}" })
        if player.save && conversation.increment_joined
          player.broadcast
          if conversation.players_joined == conversation.total_players
            GameWorkerJob.perform_now("start_game", Api::ConversationSerializer.new(conversation).attributes)
          end
          render json: player
          return
        end
      end
    end
    render json: {}, status: 401
  end

  def pending_action
    if @player
      case @player.pending_action
      when Api::Player.action_option[:role]
        case @player.secret_team_role
        when "facist"
          facist_players = @player.conversation.players.where(:secret_team_role => "facist")
          serialized_data = ActiveModel::Serializer::ArraySerializer.new(facist_players, each_serializer: Api::PlayerSerializer, show_hitler: true)
          render json: { :type => "facist_conferrence", :data => serialized_data }
          return
        when "liberal"
          render json: { :type => "liberal_conferrence" }
          return
        end
      when Api::Player.action_option[:president]
        render json: { :type => "presidental_conferrence", :data => elligible_players }
        return
      when Api::Player.action_option[:vote]
        current_election = @player.conversation.elections.find_by(:election_status => "active")
        chancellor = Api::Player.find(current_election.chancellor)
        render json: { :type => "election_day", :data => Api::PlayerSerializer.new(chancellor) }
        return
      when Api::Player.action_option[:policy_draw_president]
        current_election = @player.conversation.elections.find_by(:election_status => "active")
        render json: { :type => "presidential_choice", :data => current_election.policy_draw }
        return
      when Api::Player.action_option[:policy_draw_chancellor]
        current_election = @player.conversation.elections.find_by(:election_status => "active")
        render json: { :type => "chancellors_choice", :data => current_election.policy_picked }
        return
      when Api::Player.action_option[:default]
        render json: { :type => "none" }
        return
      end
    end
    render json: {}, status: 400
  end

  def confirm_role
    if @player && @player.pending_action == Api::Player.action_option[:role]
      @player.setPendingAction(:default)
      @player.save
      conversation = @player.conversation
      if conversation.players.where(:pending_action => Api::Player.action_option[:default]).length == conversation.total_players
        GameWorkerJob.perform_now("start_election", Api::ConversationSerializer.new(conversation).attributes)
      end
      render json: {}, status: 200
      return
    end
    render json: {}, status: 401
  end

  def confirm_chancellor
    if @player && @player.pending_action == Api::Player.action_option[:president]
      conversation = @player.conversation
      chancellor = conversation.players.find(params[:chancellor_id]) if params[:chancellor_id]
      election = conversation.elections.find_by(:election_status => "active")
      if chancellor && election
        election.chancellor = chancellor.id
        election.save
        chancellor.public_role = "chancellor"
        chancellor.save
        @player.setPendingAction(:default)
        @player.save
        broadcast_room_message(conversation.id, "#{chancellor.name} is nominated for Chancellor. Voting will now begin.")
        GameWorkerJob.perform_now("start_voting", Api::ConversationSerializer.new(conversation).attributes)
        render json: {}, status: 200
        return
      end
    end
    render json: {}, status: 401
  end

  def cast_vote
    if @player
      conversation = @player.conversation
      election = conversation.elections.find_by(:election_status => "active")
      has_voted = Api::Vote.find_by(:player_id => @player.id, :election_id => election.id)
      if !has_voted
        vote = Api::Vote.new({ :player_id => @player.id, :election_id => election.id, :ballot => params[:ballot] })
        if vote.save
          @player.setPendingAction(:default)
          @player.save
          if election.votes.length === conversation.total_players
            GameWorkerJob.perform_now("election_results", Api::ConversationSerializer.new(conversation).attributes)
          end
          render json: {}, status: 200
          return
        end
      end
    end
    render json: {}, status: 401
  end

  def presidential_policy
    if @player
      @conversation = @player.conversation
      @election = @conversation.elections.find_by(:election_status => "active")
      if @player.id == @election.president
        policy_draw = @election.policy_draw
        policy = params[:policy]
        discarded_policy = policy_draw.slice!(policy[0]) && policy_draw.slice!(policy[1])
        if policy && policy.length == 2 && policy.count("01") == 2 && discarded_policy && discarded_policy.length == 1
          @election.policy_picked = policy
          @player.setPendingAction(:default)
          @conversation.discard_pile += discarded_policy
          chancellor = Api::Player.find(@election.chancellor)
          chancellor.setPendingAction(:policy_draw_chancellor)
          chancellor.save
          save_all
          broadcast_room_message(@conversation.id, "The chancellor is picking one policy to pass out of two")
          render json: {}, status: 200
          return
        end
      end
    end
    render json: {}, status: 401
  end

  def chancellor_policy
    if @player
      @conversation = @player.conversation
      @election = @conversation.elections.find_by(:election_status => "active")
      if @player.id == @election.chancellor
        policy_picked = @election.policy_picked
        policy = params[:policy]
        discarded_policy = policy_picked.slice!(policy)
        if policy && policy.length == 1 && policy.count("01") == 1 && discarded_policy && discarded_policy.length == 1
          @conversation.policy_passed += policy
          @conversation.discard_pile += discarded_policy
          @election.election_status = "passed"
          @player.setPendingAction(:default)
          save_all
          broadcast_room_message(@conversation.id, "Government has passed a #{policy == "0" ? "Liberal" : "Facist"} policy")
          GameWorkerJob.perform_now("end_election", Api::ConversationSerializer.new(conversation).attributes)
          render json: {}, status: 200
          return
        end
      end
    end
  end

  private

  def elligible_players
    conversation = @player.conversation
    players = conversation.players
    elections = conversation.elections
    last_passed_election = elections.where(:election_status => "passed").last
    last_failed_election = elections.where(:election_status => "failed").offset(2).first
    inelligible_players = [@player.id]
    if last_passed_election && (!last_failed_election || last_failed_election.id < last_passed_election.id)
      inelligible_players << last_passed_election.chancellor
      if conversation.total_players > 5
        inelligible_players << last_passed_election.president
      end
    end
    elligible_players = []
    players.each do |player|
      unless inelligible_players.include?(player.id)
        elligible_players << Api::PlayerSerializer.new(player)
      end
    end
    elligible_players
  end

  def set_player
    @player = Api::Player.find_by(:conversation_id => params[:conversation_id], :user_id => session[:user_id])
  end

  def save_all
    @election.save
    @conversation.save
    @player.save
  end
end
