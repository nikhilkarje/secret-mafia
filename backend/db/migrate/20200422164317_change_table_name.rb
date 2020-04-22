class ChangeTableName < ActiveRecord::Migration[6.0]
  def change
    rename_table :channel_players, :players
  end
end
