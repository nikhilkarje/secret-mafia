class AddNameToPlayers < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:messages, :name, nil)
    add_column :players, :name, :string, null: false, :default => "placeholder"
  end
end
