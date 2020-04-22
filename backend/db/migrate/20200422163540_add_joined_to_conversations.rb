class AddJoinedToConversations < ActiveRecord::Migration[6.0]
  def change
    add_column :conversations, :players_joined, :integer, null: false, :default => 0
  end
end
