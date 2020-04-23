class ApiTableName < ActiveRecord::Migration[6.0]
  def change
    rename_table :api_users, :users
  end
end
