class RenamePolicyPassedToElections < ActiveRecord::Migration[6.0]
  def change
    rename_column :elections, :policy_passed, :policy_picked
  end
end
