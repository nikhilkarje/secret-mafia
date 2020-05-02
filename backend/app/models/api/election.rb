class Api::Election < ApplicationRecord
  has_many :votes, dependent: :destroy
  has_one :president, class_name: "Api::Player", :foreign_key => "president_id"
  has_one :chancellor, class_name: "Api::Player", :foreign_key => "chancellor_id"
  belongs_to :conversation

  def previous
    self.class.where("conversation_id=? AND id < ?", conversation_id, id).last
  end
end
