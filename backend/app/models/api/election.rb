class Api::Election < ApplicationRecord
  has_many :votes, dependent: :destroy
  belongs_to :conversation

  def previous
    self.class.where("conversation_id=? AND id < ?", conversation_id, id).last
  end
end
