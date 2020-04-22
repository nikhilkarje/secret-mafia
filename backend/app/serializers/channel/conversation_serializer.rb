class Channel::ConversationSerializer < ActiveModel::Serializer
  attributes :id, :title
  has_many :messages, if: -> { should_render_association }

  def should_render_association
    @instance_options[:show_children]
  end
end
