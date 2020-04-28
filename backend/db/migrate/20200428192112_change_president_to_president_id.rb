class ChangePresidentToPresidentId < ActiveRecord::Migration[6.0]
  def change
    rename_column :elections, :president, :president_id
    rename_column :elections, :chancellor, :chancellor_id
  end
end
