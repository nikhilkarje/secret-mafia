class RemoveDefaultFromPresidentIdReferrence < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:elections, :president_id, nil)
  end
end
