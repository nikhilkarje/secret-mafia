class Channel::ConversationsController < ApplicationController
  def index
    conversations = Channel::Conversation.all
    render json: conversations
  end

  def show
    player = Channel::Player.find_by(:conversation_id => params[:id], :api_user_id => session[:user_id])
    if player
      render json: player.conversation, show_children: true
      return
    end
    render json: {}, :status => 401
  end

  def create
    conversation = Channel::Conversation.new(conversation_params)
    if conversation.save
      ActionCable.server.broadcast "conversations_channel", Channel::ConversationSerializer.new(conversation)
      head :ok
    end
  end

  private

  def conversation_params
    params.require(:conversation).permit(:title)
  end
end
