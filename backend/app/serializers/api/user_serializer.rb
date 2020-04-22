class Api::UserSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name
  has_many :email, if: -> { should_render_email }

  def should_render_email
    @instance_options[:show_email]
  end
end
