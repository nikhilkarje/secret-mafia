class RemoveForeignKeyOnPresident < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key :players, :elections, name: :president_id
    remove_foreign_key :players, :elections, name: :chancellor_id
  end
end
