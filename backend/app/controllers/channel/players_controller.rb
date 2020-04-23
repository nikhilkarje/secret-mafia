class Channel::PlayersController < Channel::ConversationsController
  before_action :set_player, :except => [:create]

  def index
    if @player
      render json: @player.conversation.players
      return
    end
    render json: {}, status: 401
  end

  def create
    player = Channel::Player.find_by(:api_user_id => session[:user_id])
    if !player
      conversation = Channel::Conversation.find(params[:conversation_id])
      if conversation.players_joined < conversation.total_players
        player = Channel::Player.new({ :conversation_id => conversation.id, :api_user_id => session[:user_id] })
        if player.save && conversation.increment_joined
          if conversation.players_joined == conversation.total_players
            GameWorkerJob.perform_now("start_game", Channel::ConversationSerializer.new(conversation).attributes)
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
      when Channel::Player.action_option[:role]
        case @player.secret_team_role
        when "facist"
          facist_players = @player.conversation.players.where(:secret_team_role => "facist")
          serialized_data = ActiveModel::Serializer::ArraySerializer.new(facist_players, each_serializer: Channel::PlayerSerializer, show_hitler: true)
          render json: { :type => "facist_conferrence", :data => serialized_data }
          return
        when "liberal"
          render json: { :type => "liberal_conferrence" }
          return
        end
      when Channel::Player.action_option[:default]
        render json: { :type => "none" }
        return
      end
    end
    render json: {}, status: 400
  end

  def confirm_role
    if @player && @player.pending_action == Channel::Player.action_option[:role]
      @player.setPendingAction(:default)
      conversation = @player.conversation
      if conversation.players.where(:pending_action => Channel::Player.action_option[:default]).length == conversation.total_players
        GameWorkerJob.perform_now("start_election", Channel::ConversationSerializer.new(conversation).attributes)
      end
      render json: {}, status: 200
      return
    end
    render json: {}, status: 401
  end

  private

  def set_player
    @player = Channel::Player.find_by(:conversation_id => params[:conversation_id], :api_user_id => session[:user_id])
  end
end
