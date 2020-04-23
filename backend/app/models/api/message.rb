class Api::Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
end
