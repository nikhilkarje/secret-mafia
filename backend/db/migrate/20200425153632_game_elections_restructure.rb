class GameElectionsRestructure < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :policy_picked, :string, null: false, :default => ""
    add_column :games, :discard_pile, :string, null: false, :default => ""
    remove_column :elections, :policy_passed
    remove_column :elections, :policy_status
    remove_column :elections, :policy_discarded
  end
end
