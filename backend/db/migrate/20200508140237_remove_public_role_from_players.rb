class RemovePublicRoleFromPlayers < ActiveRecord::Migration[6.0]
  def change
    remove_column :players, :public_role
  end
end
