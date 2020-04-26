class RenameElectionReferrenceColumn < ActiveRecord::Migration[6.0]
  def change
    rename_column :elections, :conversations_id, :conversation_id
  end
end
