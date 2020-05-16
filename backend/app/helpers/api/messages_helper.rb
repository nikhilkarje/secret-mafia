module Api::MessagesHelper
  def broadcast_message(message_params, type = "default")
    message = Api::Message.new(message_params)
    if !@conversation
      @conversation = Api::Conversation.find(message_params[:conversation_id])
    end
    if message.save
      MessagesChannel.broadcast_to @conversation, JSON.parse(Api::MessageSerializer.new(message).to_json).merge("type" => type)
      return true
    end
    return false
  end

  def broadcast_room_message(conversation_id, text, type = "info")
    admin_user = Api::User.find_by(:role => "game_bot")
    broadcast_message({ :conversation_id => conversation_id, :user_id => admin_user.id, :name => admin_user.name, :text => text }, type)
  end
end
