class RenameChancellorReferrence < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:elections, :players_id, nil)
    change_column_null :elections, :players_id, true
    rename_column :elections, :players_id, :chancellor_id
  end
end
