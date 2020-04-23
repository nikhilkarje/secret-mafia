class ChangeReffernceColumnNames < ActiveRecord::Migration[6.0]
  def change
    rename_column :api_elections, :api_games_id, :api_game_id
    rename_column :api_votes, :api_elections_id, :api_election_id
    rename_column :api_votes, :players_id, :player_id
  end
end
