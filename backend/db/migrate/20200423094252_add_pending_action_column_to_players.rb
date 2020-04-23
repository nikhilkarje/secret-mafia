class AddPendingActionColumnToPlayers < ActiveRecord::Migration[6.0]
  def change
    add_column :players, :pending_action, :string, null: false, :default => "none"
  end
end
