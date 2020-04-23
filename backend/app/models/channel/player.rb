class Channel::Player < ApplicationRecord
  belongs_to :conversation
  belongs_to :api_user, :class_name => "Api::User"

  def self.status_option
    { :logged_out => "logged_out", :active => "active" }
  end

  def self.action_option
    { :role => "confirm_role", :default => "none" }
  end

  def setPendingAction(action)
    self.pending_action = Channel::Player.action_option[action]
    self.save
    PlayerUpdateChannel.broadcast_to self, Channel::PlayerSerializer.new(self)
  end

  def setStatus(status)
    self.status = Channel::Player.status_option[status]
    self.save
    PlayerUpdateChannel.broadcast_to self, Channel::PlayerSerializer.new(self)
  end

  def delete
    conversation = self.conversation.decrement_joined
    super
  end

  def private_liberal_broadcast
    self.setPendingAction(:role)
    PlayerPrivateChannel.broadcast_to self, { :type => "liberal_conferrence" }
  end

  def private_facist_broadcast(facist_players, show_hitler)
    self.setPendingAction(:role)
    serialized_data = ActiveModel::Serializer::ArraySerializer.new(facist_players, each_serializer: Channel::PlayerSerializer, show_hitler: show_hitler)
    PlayerPrivateChannel.broadcast_to self, { :type => "facist_conferrence", :data => serialized_data }
  end

  def broadcast
    unless @conversation
      @conversation = Channel::Conversation.find(self.conversation_id)
    end
    PlayersChannel.broadcast_to @conversation, Channel::PlayerSerializer.new(self)
  end
end
