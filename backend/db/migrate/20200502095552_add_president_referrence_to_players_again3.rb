class AddPresidentReferrenceToPlayersAgain3 < ActiveRecord::Migration[6.0]
  def change
    remove_column :elections, :president_id
    remove_column :elections, :chancellor_id
  end
end
