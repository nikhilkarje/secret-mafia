class AddPolicyPassedToElections < ActiveRecord::Migration[6.0]
  def change
    add_column :elections, :policy_passed, :string
    remove_column :elections, :policy_picked
    rename_column :games, :policy_picked, :policy_passed
  end
end
