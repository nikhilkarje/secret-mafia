class AddNameToMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :messages, :name, :string, null: false, :default => "placeholder"
  end
end
