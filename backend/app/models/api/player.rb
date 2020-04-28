include Api::ConversationsHelper

class Api::Player < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
  has_many :votes, dependent: :destroy
  scope :filter_by_active, -> { where status: self.status_option[:active] }

  def self.status_option
    { :active => "active", :dead => "dead", :investigated => "investigated" }
  end

  def check_status(status)
    Api::Player.status_option[status] == self.status
  end

  def set_status(status)
    self.status = Api::Player.status_option[status]
    self.save
  end

  def self.public_role_option
    { :default => "default", :president => "president", :chancellor => "chancellor" }
  end

  def set_public_role(role)
    self.public_role = Api::Player.public_role_option[role]
    self.save
  end

  def self.action_option
    action_option_hash = {}
    action_list = [:confirm_role, :choose_chancellor, :policy_draw_president, :policy_draw_chancellor,
                   :policy_draw_chancellor_forced, :confirm_veto, :vote, :confirm_investigation, :end_game,
                   :default].concat(facist_power_list())
    action_list.each { |key| action_option_hash[key] = key.to_s }
    action_option_hash
  end

  def set_pending_action(action)
    self.pending_action = Api::Player.action_option[action]
    self.save
  end

  def check_pending_action(action)
    Api::Player.action_option[action] == self.pending_action
  end

  def delete
    conversation = self.conversation.decrement_joined
    super
  end

  # TODO: Change default value from liberal to default
  def save
    p = super
    if p
      PlayersChannel.broadcast_to self.conversation, { :type => "update", :data => Api::PlayerSerializer.new(self) }
    end
    p
  end

  def broadcast
    PlayersChannel.broadcast_to self.conversation, { :type => "new", :data => Api::PlayerSerializer.new(self) }
  end

  def next_active
    player = Api::Player.where("conversation_id=? AND status=? AND id > ?", conversation_id, Api::Player.status_option[:active], id).first
    if !player
      player = Api::Player.where(:conversation_id => conversation_id).first
    end
    player
  end

  def previous_active
    player = Api::Player.where("conversation_id=? AND status=? AND id < ?", conversation_id, Api::Player.status_option[:active], id).last
    if !player
      player = Api::Player.where(:conversation_id => conversation_id).last
    end
    player
  end
end
