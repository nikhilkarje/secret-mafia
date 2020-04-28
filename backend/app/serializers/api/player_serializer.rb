class Api::PlayerSerializer < ActiveModel::Serializer
  attributes :id, :conversation_id, :name, :public_role, :status, :pending_action, :user_id
  attribute :secret_special_role, if: :should_show_secret_role
  attribute :secret_team_role, if: :should_show_team_role

  def should_show_secret_role
    @instance_options[:show_hitler]
  end

  def should_show_team_role
    @instance_options[:show_team]
  end
end
