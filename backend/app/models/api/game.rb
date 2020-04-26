class Api::Game < ApplicationRecord
  has_many :elections
  belongs_to :conversation

  def save
    super
    GameChannel.broadcast_to self.conversation, Api::GameSerializer.new(self)
  end
end
