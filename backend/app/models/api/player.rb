class Api::Player < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
  has_many :votes

  def self.status_option
    { :active => "active" }
  end

  def self.action_option
    { :role => "confirm_role", :president => "choose_chancellor", :policy_draw_president => "choose_2_policies", :policy_draw_chancellor => "choose_1_policy", :vote => "vote", :default => "none" }
  end

  def setPendingAction(action)
    self.pending_action = Api::Player.action_option[action]
  end

  def setStatus(status)
    self.status = Api::Player.status_option[status]
  end

  def delete
    conversation = self.conversation.decrement_joined
    super
  end

  # TODO: Change default value from liberal to default
  def save
    super
    PlayersChannel.broadcast_to self.conversation, { :type => "update", :data => Api::PlayerSerializer.new(self) }
  end

  def broadcast
    PlayersChannel.broadcast_to self.conversation, { :type => "new", :data => Api::PlayerSerializer.new(self) }
  end

  def next
    player = Api::Player.where("conversation_id=? AND id > ?", conversation_id, id).first
    if !player
      player = Api::Player.where(:conversation_id => conversation_id).first
    end
    player
  end

  def previous
    player = Api::Player.where("conversation_id=? AND id < ?", conversation_id, id).last
    if !player
      player = Api::Player.where(:conversation_id => conversation_id).last
    end
    player
  end
end
