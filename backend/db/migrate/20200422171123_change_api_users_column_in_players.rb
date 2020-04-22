class ChangeApiUsersColumnInPlayers < ActiveRecord::Migration[6.0]
  def change
    rename_column :players, :api_users_id, :api_user_id
  end
end
