class AddPresidentReferrenceToPlayersAgain2 < ActiveRecord::Migration[6.0]
  def change
    remove_column :elections, :president_id
    remove_column :elections, :chancellor_id
    add_reference :elections, :president, references: :players, index: true
    add_foreign_key :elections, :players, column: :president_id
    add_reference :elections, :chancellor, references: :players, index: true
    add_foreign_key :elections, :players, column: :chancellor_id
  end
end
