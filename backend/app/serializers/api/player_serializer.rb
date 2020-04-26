class Api::PlayerSerializer < ActiveModel::Serializer
  attributes :id, :conversation_id, :name, :public_role, :status, :pending_action, :user_id
  attribute :secret_special_role, if: :should_show_secret_role

  def should_show_secret_role
    @instance_options[:show_hitler]
  end
end
