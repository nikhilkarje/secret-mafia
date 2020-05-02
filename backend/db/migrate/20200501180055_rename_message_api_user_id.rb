class RenameMessageApiUserId < ActiveRecord::Migration[6.0]
  def change
    rename_column :messages, :api_user_id, :user_id
  end
end
