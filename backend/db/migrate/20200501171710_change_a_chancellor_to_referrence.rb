class ChangeAChancellorToReferrence < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:elections, :players_id, nil)
    rename_column :elections, :players_id, :president_id
    add_reference :elections, :players, null: false, foreign_key: true, :default => 0
  end
end
