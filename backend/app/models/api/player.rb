class Api::Player < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
  has_many :votes

  def self.status_option
    { :logged_out => "logged_out", :active => "active" }
  end

  def self.action_option
    { :role => "confirm_role", :president => "choose_chancellor", :default => "none" }
  end

  def setPendingAction(action)
    self.pending_action = Api::Player.action_option[action]
    self.save
    PlayerUpdateChannel.broadcast_to self, Api::PlayerSerializer.new(self)
  end

  def setStatus(status)
    self.status = Api::Player.status_option[status]
    self.save
    PlayerUpdateChannel.broadcast_to self, Api::PlayerSerializer.new(self)
  end

  def delete
    conversation = self.conversation.decrement_joined
    super
  end

  def broadcast_role_action
    self.setPendingAction(:role)
  end

  def broadcast_president_action
    self.setPendingAction(:president)
  end

  def broadcast
    unless @conversation
      @conversation = Api::Conversation.find(self.conversation_id)
    end
    PlayersChannel.broadcast_to @conversation, Api::PlayerSerializer.new(self)
  end

  def next
    player = self.class.where("conversation_id=? AND id > ?", conversation_id, id).first
    if !player
      player = self.class.where(:conversation_id => conversation_id).first
    end
  end

  def previous
    player = self.class.where("conversation_id=? AND id < ?", conversation_id, id).last
    if !player
      player = self.class.where(:conversation_id => conversation_id).last
    end
  end
end
