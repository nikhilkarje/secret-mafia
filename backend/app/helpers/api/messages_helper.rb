module Api::MessagesHelper
  def broadcast_message(message_params)
    message = Api::Message.new(message_params)
    if !@conversation
      @conversation = Api::Conversation.find(message_params[:conversation_id])
    end
    if message.save
      MessagesChannel.broadcast_to @conversation, Api::MessageSerializer.new(message)
      return true
    end
    return false
  end
end
