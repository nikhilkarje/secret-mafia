class RemovePresidentIdReferrence < ActiveRecord::Migration[6.0]
  def change
    remove_column :players, :president_id
    remove_column :players, :chancellor_id
    add_column :elections, :president_id, :integer, null: false, :default => 0
    add_column :elections, :chancellor_id, :integer
  end
end
