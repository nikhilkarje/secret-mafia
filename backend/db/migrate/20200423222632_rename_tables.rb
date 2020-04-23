class RenameTables < ActiveRecord::Migration[6.0]
  def change
    rename_table :api_elections, :elections
    rename_table :api_games, :games
    rename_table :api_votes, :votes
  end
end
