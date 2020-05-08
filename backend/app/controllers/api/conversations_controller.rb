class Api::ConversationsController < ApplicationController
  include Api::ConversationsHelper

  def index
    conversations = Api::Conversation.all
    render json: conversations
  end

  def show
    player = Api::Player.find_by(:conversation_id => params[:id], :user_id => session[:user_id])
    if player
      render json: player.conversation, serializer: Api::GameSerializer, show_children: true
      return
    end
    render json: {}, :status => 401
  end

  def create
    conversation = Api::Conversation.new(conversation_params.merge({ :policy_order => generate_policy_order }))
    if conversation.save
      render json: conversation
    end
  end

  private

  def conversation_params
    params.require(:conversation).permit(:title, :total_players)
  end
end
