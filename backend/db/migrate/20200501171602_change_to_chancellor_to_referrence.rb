class ChangeToChancellorToReferrence < ActiveRecord::Migration[6.0]
  def change
    add_reference :elections, :players, null: false, foreign_key: true, :default => 0
  end
end
