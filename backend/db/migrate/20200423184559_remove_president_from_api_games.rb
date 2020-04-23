class RemovePresidentFromApiGames < ActiveRecord::Migration[6.0]
  def change
    remove_column :api_games, :president
    remove_column :api_games, :chancellor
    remove_column :api_games, :liberal_policies
    remove_column :api_games, :facist_policies
    change_column :api_games, :policy_order, :string
  end
end
