class CreateApiElections < ActiveRecord::Migration[6.0]
  def change
    create_table :api_elections do |t|
      t.integer :president, null: false
      t.integer :chancellor, null: false
      t.string :election_status, null: false, :default => "active"
      t.string :policy_status
      t.string :policy_draw
      t.string :policy_passed
      t.string :policy_picked
      t.string :policy_discarded
      t.references :api_games, null: false, foreign_key: true
      t.timestamps
    end
  end
end
