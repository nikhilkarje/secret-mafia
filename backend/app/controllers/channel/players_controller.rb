class Channel::PlayersController < Channel::ConversationsController
  def index
    conversation = Channel::Conversation.find(params[:conversation_id])
    render json: conversation.players
  end

  def create
    conversation = Channel::Conversation.find(params[:conversation_id])
    player = Channel::Player.find_by(:conversation_id => params[:conversation_id], :api_user_id => session[:user_id])
    if !player && conversation.players_joined < conversation.total_players
      player = Channel::Player.new({ :conversation_id => conversation.id, :api_user_id => session[:user_id] })
      if player.save && conversation.increment_joined
        render json: player
        return
      end
    end
    render json: {}, status: 401
  end
end
