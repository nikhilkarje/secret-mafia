class Api::Vote < ApplicationRecord
  belongs_to :election
  belongs_to :player
end
