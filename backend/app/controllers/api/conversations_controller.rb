class Api::ConversationsController < ApplicationController
  def index
    conversations = Api::Conversation.all
    render json: conversations
  end

  def show
    player = Api::Player.find_by(:conversation_id => params[:id], :user_id => session[:user_id])
    if player
      render json: player.conversation, show_children: true
      return
    end
    render json: {}, :status => 401
  end

  def create
    conversation = Api::Conversation.new(conversation_params)
    if conversation.save
      ActionCable.server.broadcast "conversations_channel", Api::ConversationSerializer.new(conversation)
      head :ok
    end
  end

  private

  def conversation_params
    params.require(:conversation).permit(:title)
  end
end