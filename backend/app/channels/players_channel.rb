class PlayersChannel < ApplicationCable::Channel
  include ApplicationHelper

  def subscribed
    conversation = Channel::Conversation.find(params[:conversation])
    if !conversation.players.find(current_user.id)
      reject
      return
    end

    broadcast_message({ :conversation_id => conversation.id, :api_user_id => 6, :text => "#{current_user.first_name} #{current_user.last_name} just joined the game" })
    player = Channel::Player.find_by(:conversation_id => conversation.id, :api_user_id => current_user.id)
    player.setStatus("active")
    player.broadcast
    stream_for conversation
  end

  def unsubscribed
    conversation = Channel::Conversation.find(params[:conversation])
    player = Channel::Player.find_by(:conversation_id => conversation.id, :api_user_id => current_user.id)
    player.setStatus("logged_out")
    broadcast_message({ :conversation_id => conversation.id, :api_user_id => 6, :text => "#{current_user.first_name} #{current_user.last_name} just left the game" })
  end
end
