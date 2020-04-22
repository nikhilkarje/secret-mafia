class Channel::PlayerSerializer < ActiveModel::Serializer
  attributes :id, :conversation_id, :user, :public_role, :status

  def user
    user = Api::UserSerializer.new(Api::User.find(object.api_user_id))
  end
end
