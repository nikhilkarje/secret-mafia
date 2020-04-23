class ChangeApiUsersColumnInPlayers < ActiveRecord::Migration[6.0]
  def change
    rename_column :players, :api_users_id, :user_id
  end
end
