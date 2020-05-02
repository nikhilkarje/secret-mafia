class ChangeChancellorToReferrence < ActiveRecord::Migration[6.0]
  def change
    remove_column :elections, :conversations_id
  end
end
