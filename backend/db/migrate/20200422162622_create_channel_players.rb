class CreateChannelPlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :channel_players do |t|
      t.string :status, null: false, :default => "logged_out"
      t.string :secret_team_role, null: false, :default => "liberal"
      t.string :secret_special_role
      t.string :public_role, null: false, :default => "default"
      t.references :conversation, null: false, foreign_key: true
      t.references :api_users, null: false, foreign_key: true

      t.timestamps
    end
  end
end
