class Channel::Conversation < ApplicationRecord
  has_many :messages
  has_many :players

  def increment_joined
    self.players_joined += 1
    self.save
  end

  def decrement_joined
    self.players_joined -= 1
    self.save
  end
end
