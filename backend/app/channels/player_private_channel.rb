class PlayerPrivateChannel < ApplicationCable::Channel
  def subscribed
    player = Channel::Player.find(params[:player])
    if player.api_user_id != current_user.id
      reject
      return
    end
    stream_for player
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
