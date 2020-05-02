class Remove < ActiveRecord::Migration[6.0]
  def change
    remove_column :elections, :president_id
    remove_column :elections, :chancellor_id
    add_reference :players, :president, references: :elections, index: true, null: false, :default => 0
    add_foreign_key :players, :elections, column: :president_id
    add_reference :players, :chancellor, references: :elections, index: true
    add_foreign_key :players, :elections, column: :chancellor_id
  end
end
