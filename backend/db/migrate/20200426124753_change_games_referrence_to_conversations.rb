class ChangeGamesReferrenceToConversations < ActiveRecord::Migration[6.0]
  def change
    remove_column :elections, :game_id
    add_reference :elections, :conversations, null: false, foreign_key: true, :default => 1
  end
end
