class Api::Election < ApplicationRecord
  has_many :votes
  belongs_to :game

  def previous
    self.class.where("game_id=? AND id < ?", game_id, id).last
  end
end
