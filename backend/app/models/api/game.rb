class Api::Game < ApplicationRecord
  has_many :elections
  belongs_to :conversation
end
