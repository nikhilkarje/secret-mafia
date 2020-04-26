class Api::Conversation < ApplicationRecord
  has_many :messages
  has_many :players
  has_many :elections

  def increment_joined
    self.players_joined += 1
    self.save
  end

  def decrement_joined
    self.players_joined -= 1
    self.save
  end

  def save
    super
    GameChannel.broadcast_to self, Api::GameSerializer.new(self)
  end
end
