class AddPlayerIdToElections < ActiveRecord::Migration[6.0]
  def change
    add_column :elections, :president_id, :integer, null: false, :default => 0
    add_column :elections, :chancellor_id, :integer
  end
end
