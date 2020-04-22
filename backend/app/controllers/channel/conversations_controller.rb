class Channel::ConversationsController < ApplicationController
  def index
    conversations = Channel::Conversation.all
    render json: conversations
  end

  def show
    conversation = Channel::Conversation.find(params[:id])
    render json: conversation, show_children: true
  end

  def create
    conversation = Channel::Conversation.new(conversation_params)
    if conversation.save
      serialized_data = ActiveModelSerializers::Adapter::Json.new(
        Channel::ConversationSerializer.new(conversation)
      ).serializable_hash
      ActionCable.server.broadcast "conversations_channel", serialized_data
      head :ok
    end
  end

  private

  def conversation_params
    params.require(:conversation).permit(:title)
  end
end
