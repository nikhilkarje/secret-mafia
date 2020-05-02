class ChangePresidentToReferrence < ActiveRecord::Migration[6.0]
  def change
    remove_column :elections, :president_id
    remove_column :elections, :chancellor_id
    add_reference :elections, :conversations, null: false, foreign_key: true, :default => 0
  end
end
