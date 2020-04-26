class MessagesChannel < ApplicationCable::Channel
  def subscribed
    # TODO: Add validation
    conversation = Api::Conversation.find(params[:conversation])
    isTeam = Api::Player.find_by(:conversation_id => conversation.id, :user_id => current_user.id)
    unless isTeam
      reject
      return
    end
    stream_for conversation
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
