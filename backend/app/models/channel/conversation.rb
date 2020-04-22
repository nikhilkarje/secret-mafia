class Channel::Conversation < ApplicationRecord
  has_many :messages
end
