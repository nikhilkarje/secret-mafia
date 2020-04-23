class RemoveNullRestraintOfChancellorInApiElections < ActiveRecord::Migration[6.0]
  def change
    # change_column :api_elections, :chancellor, :string, :null => true
    change_column_null :api_elections, :chancellor, true
  end
end
