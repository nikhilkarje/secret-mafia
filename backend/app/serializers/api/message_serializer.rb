class Api::MessageSerializer < ActiveModel::Serializer
  attributes :id, :conversation_id, :user_id, :name, :text, :created_at
end
