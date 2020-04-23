class PlayerUpdateChannel < ApplicationCable::Channel
  def subscribed
    player = Channel::Player.find(params[:player])
    isTeam = player.conversation.players.find_by(:api_user_id => current_user.id)
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
