class Channel::PlayerSerializer < ActiveModel::Serializer
  attributes :id, :conversation_id, :user, :public_role, :status, :pending_action
  attributes :secret_special_role, if: -> { show_hitler }

  def user
    user = Api::UserSerializer.new(Api::User.find(object.api_user_id))
  end
end
