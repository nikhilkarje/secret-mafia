class TotalPlayersToConversations < ActiveRecord::Migration[6.0]
  def change
    add_column :conversations, :total_players, :integer, null: false, :default => 5
  end
end
