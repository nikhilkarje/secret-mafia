class ChangeColumnReferrence < ActiveRecord::Migration[6.0]
  def change
    rename_column :elections, :api_game_id, :game_id
    rename_column :votes, :api_election_id, :election_id
  end
end
