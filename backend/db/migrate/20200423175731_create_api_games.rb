class CreateApiGames < ActiveRecord::Migration[6.0]
  def change
    create_table :api_games do |t|
      t.integer :election_tracker, null: false, :default => 0
      t.binary :policy_order, :limit => 17
      t.integer :liberal_policies, null: false, :default => 0
      t.integer :facist_policies, null: false, :default => 0
      t.integer :president
      t.integer :chancellor
      t.references :conversation, null: false, foreign_key: true
      t.timestamps
    end
  end
end
