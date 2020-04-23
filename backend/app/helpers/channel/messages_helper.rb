module Channel::MessagesHelper
  def broadcast_message(message_params)
    message = Channel::Message.new(message_params)
    if !@conversation
      @conversation = Channel::Conversation.find(message_params[:conversation_id])
    end
    if message.save
      MessagesChannel.broadcast_to @conversation, Channel::MessageSerializer.new(message)
      return true
    end
    return false
  end
end
