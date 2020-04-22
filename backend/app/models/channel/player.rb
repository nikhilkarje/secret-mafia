class Channel::Player < ApplicationRecord
  belongs_to :conversation
  belongs_to :api_user, :class_name => "Api::User"

  def self.status_option
    { "logged_out" => "logged_out", "active" => "active" }
  end

  def setStatus(status)
    self.status = Channel::Player.status_option[status]
    self.save
  end

  def broadcast
    conversation = Channel::Conversation.find(self.conversation_id)
    PlayersChannel.broadcast_to conversation, Channel::PlayerSerializer.new(self)
  end
end
