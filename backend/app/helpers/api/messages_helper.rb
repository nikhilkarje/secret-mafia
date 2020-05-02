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

  def broadcast_room_message(conversation_id, text)
    admin_user = Api::User.find_by(:role => "game_bot")
    broadcast_message({ :conversation_id => conversation_id, :user_id => admin_user.id, :name => admin_user.name, :text => text })
  end
end
