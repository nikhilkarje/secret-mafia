class Channel::MessageSerializer < ActiveModel::Serializer
  attributes :id, :conversation_id, :api_user_id, :name, :text, :created_at
end
