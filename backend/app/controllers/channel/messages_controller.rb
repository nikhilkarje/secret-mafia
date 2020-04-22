class Channel::MessagesController < ApplicationController
  def show
    messages = Channel::Conversation.all
    render json: messages
  end

  def create
    message = Channel::Message.new(message_params)
    conversation = Channel::Conversation.find(message_params[:conversation_id])
    if message.save
      serialized_data = ActiveModelSerializers::Adapter::Json.new(
        Channel::MessageSerializer.new(message)
      ).serializable_hash
      MessagesChannel.broadcast_to conversation, serialized_data
      head :ok
    end
  end

  private

  def message_params
    params.require(:message).permit(:text, :conversation_id, :api_user_id)
  end
end
