class AddGameFieldsToConversation < ActiveRecord::Migration[6.0]
  def change
    add_column :conversations, :election_tracker, :integer, null: false, :default => 0
    add_column :conversations, :policy_order, :string, :limit => 17
    add_column :conversations, :policy_passed, :string, null: false, :default => ""
    add_column :conversations, :discard_pile, :string, null: false, :default => ""
  end
end
