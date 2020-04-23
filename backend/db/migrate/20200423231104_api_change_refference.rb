class ApiChangeRefference < ActiveRecord::Migration[6.0]
  def change
    rename_column :messages, :api_user_id, :user_id
    rename_column :players, :api_user_id, :user_id
  end
end
