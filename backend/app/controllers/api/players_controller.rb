class Api::PlayersController < Api::ConversationsController
  include Api::MessagesHelper
  include Api::ConversationsHelper
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
      when Api::Player.action_option[:confirm_role]
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
      when Api::Player.action_option[:choose_chancellor]
        render json: { :type => "presidental_conferrence", :data => elligible_players }
        return
      when Api::Player.action_option[:vote]
        current_election = @player.conversation.elections.find_by(:election_status => "active")
        chancellor = Api::Player.find(current_election.chancellor_id)
        render json: { :type => "election_day", :data => Api::PlayerSerializer.new(chancellor) }
        return
      when Api::Player.action_option[:policy_draw_president]
        current_election = @player.conversation.elections.find_by(:election_status => "active")
        render json: { :type => "presidential_choice", :data => current_election.policy_draw }
        return
      when Api::Player.action_option[:policy_draw_chancellor], Api::Player.action_option[:policy_draw_chancellor_forced]
        current_election = @player.conversation.elections.find_by(:election_status => "active")
        render json: { :type => "chancellors_choice", :data => current_election.policy_picked }
        return
      when current_election = @player.conversation.elections.find_by(:election_status => "active")
        render json: { :type => "chancellors_choice_forced", :data => current_election.policy_picked }
        return
      when Api::Player.action_option[:kill]
        render json: { :type => "kill", :data => other_players }
        return
      when Api::Player.action_option[:examine_deck]
        top_three_policies = @player.conversation.policy_order[0..2]
        render json: { :type => "examine_deck", :data => top_three_policies }
        return
      when Api::Player.action_option[:examine_player]
        render json: { :type => "examine_player", :data => other_players }
        return
      when Api::Player.action_option[:confirm_investigation]
        player = Api.Player.find_by(:conversation_id => @player.conversation_id, :status => Api::Player.status_option[:investigated])
        render json: { :type => "confirm_investigation", :data => Api::PlayerSerializer.new(player, :show_team => true) }
        return
      when Api::Player.action_option[:pick_president]
        render json: { :type => "pick_president", :data => other_players }
        return
      when Api::Player.action_option[:end_game]
        @conversation = @player.conversation
        @players = @conversation.players
        serialized_data = ActiveModel::Serializer::ArraySerializer.new(@players, each_serializer: Api::PlayerSerializer,
                                                                                 show_team: true, show_hitler: true)
        message = winning_message
        render json: { :type => "end_game", :message => message, :data => serialized_data }
        return
      when Api::Player.action_option[:default]
        render json: { :type => "none" }
        return
      end
    end
    render json: {}, status: 400
  end

  def confirm_role
    if @player && @player.check_pending_action(:confirm_role)
      @player.set_pending_action(:default)
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
    if @player && @player.check_pending_action(:choose_chancellor)
      conversation = @player.conversation
      chancellor = conversation.players.filter_by_active.find(params[:chancellor_id]) if params[:chancellor_id]
      election = conversation.elections.find_by(:election_status => "active")
      if chancellor && election
        election.chancellor_id = chancellor.id
        election.save
        chancellor.set_public_role(:chancellor)
        @player.set_pending_action(:default)
        broadcast_room_message(conversation.id, "#{chancellor.name} is nominated for Chancellor. Voting will now begin.")
        GameWorkerJob.perform_now("start_voting", Api::ConversationSerializer.new(conversation).attributes)
        render json: {}, status: 200
        return
      end
    end
    render json: {}, status: 401
  end

  def cast_vote
    if @player && @player.check_pending_action(:vote)
      conversation = @player.conversation
      election = conversation.elections.find_by(:election_status => "active")
      has_voted = Api::Vote.find_by(:player_id => @player.id, :election_id => election.id)
      if !has_voted
        vote = Api::Vote.new({ :player_id => @player.id, :election_id => election.id, :ballot => params[:ballot] })
        if vote.save
          @player.set_pending_action(:default)
          if election.votes.length === conversation.players.filter_by_active.length
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
    if @player && @player.check_pending_action(:policy_draw_president)
      @conversation = @player.conversation
      @election = @conversation.elections.find_by(:election_status => "active")
      policy_draw = @election.policy_draw
      policy = params[:policy]
      discarded_policy = policy_draw.slice!(policy[0]) && policy_draw.slice!(policy[1])
      if policy && policy.length == 2 && policy.count("01") == 2 && discarded_policy && discarded_policy.length == 1
        @election.policy_picked = policy
        @conversation.discard_pile += discarded_policy
        chancellor = Api::Player.find(@election.chancellor_id)
        save_all
        chancellor.set_pending_action(:policy_draw_chancellor)
        @player.set_pending_action(:default)
        broadcast_room_message(@conversation.id, "The chancellor is picking one policy to pass out of two")
        render json: {}, status: 200
        return
      end
    end
    render json: {}, status: 401
  end

  def chancellor_policy
    if @player && @player.check_pending_action(:policy_draw_chancellor) || @player.check_pending_action(:policy_draw_chancellor_forced)
      @conversation = @player.conversation
      @election = @conversation.elections.find_by(:election_status => "active")
      if @player.id == @election.chancellor_id
        policy_picked = @election.policy_picked
        policy = params[:policy]
        discarded_policy = policy_picked.slice!(policy)
        if policy && policy.length == 1 && policy.count("01") == 1 && discarded_policy && discarded_policy.length == 1
          @conversation.policy_passed += policy
          @conversation.discard_pile += discarded_policy
          @election.election_status = "passed"
          save_all
          @player.set_pending_action(:default)
          broadcast_room_message(@conversation.id, "Government has passed a #{policy == "0" ? "Liberal" : "Facist"} policy")
          GameWorkerJob.perform_now("end_election", Api::ConversationSerializer.new(@conversation).attributes)
          render json: {}, status: 200
          return
        end
      end
    end
    render json: {}, status: 401
  end

  def veto
    if @player && @player.check_pending_action(:policy_draw_chancellor)
      @conversation = @player.conversation
      @election = @conversation.elections.find_by(:election_status => "active")
      facist_policies = @conversation.policy_passed.count("1")
      if @player.id == @election.chancellor_id && facist_policies == 5
        @player.set_pending_action(:default)
        @election.president.set_pending_action(:confirm_veto)
        render json: {}, status: 200
      end
    end
    render json: {}, status: 401
  end

  def confirm_veto
    if @player && @player.check_pending_action(:confirm_veto)
      @conversation = @player.conversation
      @election = @conversation.elections.find_by(:election_status => "active")
      if @player.id == @election.president_id
        broadcast_room_message(@conversation.id, "The government has vetoed the current session")
        fail_election
        save_all
        @player.set_pending_action(:default)
        render json: {}, status: 200
      end
    end
    render json: {}, status: 401
  end

  def kill_player
    if params[:dead_player_id] && @player && @player.check_pending_action(:kill)
      @conversation = @player.conversation
      dead_player = @conversation.players.filter_by_active.find(params[:dead_player_id])
      if dead_player
        dead_player.set_status(:dead)
        @player.set_pending_action(:default)
        broadcast_room_message(@conversation.id, "President has executed #{dead_player.name}")
        if dead_player.secret_special_role && dead_player.secret_special_role == "hitler"
          reveal_team
        else
          GameWorkerJob.perform_now("start_election", Api::ConversationSerializer.new(@conversation).attributes)
        end
        render json: {}, status: 200
        return
      end
    end
    render json: {}, status: 401
  end

  def confirm_deck
    if @player && @player.check_pending_action(:examine_deck)
      @player.set_pending_action(:default)
      GameWorkerJob.perform_now("start_election", Api::ConversationSerializer.new(@player.conversation).attributes)
      render json: {}, status: 200
      return
    end
    render json: {}, status: 401
  end

  def examine_player
    if params[:investigated_player_id] && @player && @player.check_pending_action(:examine_player)
      @conversation = @player.conversation
      investigated_player = @conversation.players.filter_by_active.find(params[:investigated_player_id])
      if investigated_player
        investigated_player.set_status(:investigated)
        @player.set_pending_action(:confirm_investigation)
        broadcast_room_message(@conversation.id, "President is investigating #{investigated_player.name}'s role'")
        render json: {}, status: 200
        return
      end
    end
    render json: {}, status: 401
  end

  def confirm_investigation
    if @player && @player.check_pending_action(:confirm_player_role)
      investigated_player = Api.Player.find_by(:conversation_id => @player.conversation_id, :status => Api::Player.status_option[:investigated])
      investigated_player.set_status(:active)
      @player.set_pending_action(:default)
      GameWorkerJob.perform_now("start_election", Api::ConversationSerializer.new(@player.conversation).attributes)
      render json: {}, status: 200
      return
    end
    render json: {}, status: 401
  end

  # TODO: Implement President tracker
  def choose_president
    if params[:president_id] && @player && @player.check_pending_action(:choose_president) && params[:president_id] != @player.id
      @conversation = @player.conversation
      new_president = @conversation.players.filter_by_active.find(params[:president_id])
      if new_president
        nominate_president(new_president)
        @player.set_public_role(:default)
        last_chancellor = Api::Player.find(:conversation_id => @conversation.id, :public_role => Api::Player.public_role_option[:chancellor])
        last_chancellor.set_public_role(:default)
        @player.set_pending_action(:default)
        broadcast_room_message(@conversation.id, "#{new_president.name} has been nomminated as the new President by the old President")
        render json: {}, status: 200
        return
      end
    end
    render json: {}, status: 401
  end

  private

  def winning_message
    liberal_policies = @conversation.policy_passed.count("0")
    facist_policies = @conversation.policy_passed.count("1")
    message = "Something unexpected happened. Sorry for the inconvenience"
    if liberal_policies >= 5
      message = "Five Liberal policies are enacted. Liberals win."
      reveal_team
    elsif facist_policies >= 6
      message = "Six Facist policies are enacted. Facists win."
    else
      if !@players
        @players = @conversation.players
      end
      secret_hitler = @players.find_by(:secret_special_role => "hitler")
      if secret_hitler.check_status(:dead)
        message = "Secret Hitler is dead. Liberals win"
      elsif facist_policies > 3
        election = @conversation.elections.find_by(:election_status => "active")
        if election.chancellor_id == @player.id
          message = "Secret Hitler has been voted as Chancellor. Facists win."
        end
      end
    end
    message
  end

  def other_players
    other_players_list = []
    players = Api::Player.where(:conversation_id => @player.conversation_id, :status => Api::Player.status_option[:active])
    players.each { |player| other_players_list << Api::PlayerSerializer.new(player) unless player.id == @player.id }
    other_players_list
  end

  def elligible_players
    conversation = @player.conversation
    players = conversation.players.filter_by_active
    elections = conversation.elections
    last_passed_election = elections.where(:election_status => "passed").last
    last_failed_election = elections.where(:election_status => "failed").offset(2).first
    inelligible_players = [@player.id]
    if last_passed_election && (!last_failed_election || last_failed_election.id < last_passed_election.id)
      inelligible_players << last_passed_election.chancellor_id
      if players.length > 5
        inelligible_players << last_passed_election.president_id
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
  end
end
