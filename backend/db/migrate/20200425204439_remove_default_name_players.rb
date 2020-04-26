class RemoveDefaultNamePlayers < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:players, :name, nil)
  end
end
