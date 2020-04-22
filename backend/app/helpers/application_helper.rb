module ApplicationHelper
  def bootstrap_javascript
    @bootstrap_javascript = "<script type=\"text/javascript\">window.config = #{config_json.to_json};</script>"
  end

  def config_json
    {
      user_id: session[:user_id],
    }
  end

  def broadcast_message(message_params)
    message = Channel::Message.new(message_params)
    conversation = Channel::Conversation.find(message_params[:conversation_id])
    if message.save
      MessagesChannel.broadcast_to conversation, Channel::MessageSerializer.new(message)
      return true
    end
    return false
  end
end
