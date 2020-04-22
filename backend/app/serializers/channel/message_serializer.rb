class Channel::MessageSerializer < ActiveModel::Serializer
  attributes :id, :conversation_id, :user, :text, :created_at

  def user
    user = Api::UserSerializer.new(Api::User.find(object.api_user_id))
  end
end
