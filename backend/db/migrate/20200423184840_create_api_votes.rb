class CreateApiVotes < ActiveRecord::Migration[6.0]
  def change
    create_table :api_votes do |t|
      t.boolean :ballot, null: false
      t.references :players, null: false, foreign_key: true
      t.references :api_elections, null: false, foreign_key: true
      t.timestamps
    end
  end
end
