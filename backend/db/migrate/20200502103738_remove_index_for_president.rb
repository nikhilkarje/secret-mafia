class RemoveIndexForPresident < ActiveRecord::Migration[6.0]
  def change
    remove_index :players, name: "index_players_on_president_id"
    remove_index :players, name: "index_players_on_chancellor_id"
  end
end
