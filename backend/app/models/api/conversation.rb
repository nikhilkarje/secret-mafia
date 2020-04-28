class Api::Conversation < ApplicationRecord
  has_many :messages, dependent: :destroy
  has_many :players, dependent: :destroy
  has_many :elections, dependent: :destroy

  def increment_joined
    self.players_joined += 1
    self.save
  end

  def decrement_joined
    self.players_joined -= 1
    self.save
  end

  def save
    c = super
    if c
      GameChannel.broadcast_to self, Api::GameSerializer.new(self)
    end
    c
  end
end
