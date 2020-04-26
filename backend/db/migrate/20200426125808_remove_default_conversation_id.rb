class RemoveDefaultConversationId < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:elections, :conversation_id, nil)
  end
end
