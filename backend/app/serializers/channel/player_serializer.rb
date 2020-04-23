class Channel::PlayerSerializer < ActiveModel::Serializer
  attributes :id, :conversation_id, :user, :public_role, :status, :pending_action
  attribute :secret_special_role, if: :should_show_secret_role

  def user
    user = Api::UserSerializer.new(object.api_user)
  end

  def should_show_secret_role
    @instance_options[:show_hitler]
  end
end
