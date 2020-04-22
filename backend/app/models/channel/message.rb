class Channel::Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :api_user, :class_name => "Api::User"
end
