class PlayerPrivateChannel < ApplicationCable::Channel
  def subscribed
    player = Api::Player.find(params[:player])
    if player.user_id != current_user.id
      reject
      return
    end
    stream_for player
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
