class RemoveDefaultPresidentReferrence < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:players, :president_id, nil)
  end
end
