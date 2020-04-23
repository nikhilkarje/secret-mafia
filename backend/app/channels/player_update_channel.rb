class PlayerUpdateChannel < ApplicationCable::Channel
  def subscribed
    player = Api::Player.find(params[:player])
    isTeam = player.conversation.players.find_by(:user_id => current_user.id)
    unless isTeam
      reject
      return
    end
    stream_for player
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
