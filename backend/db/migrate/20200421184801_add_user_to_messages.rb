class AddUserToMessages < ActiveRecord::Migration[6.0]
  def change
    add_reference :messages, :api_user, null: false, foreign_key: true, :default => 1
  end
end
