class PlayersChannel < ApplicationCable::Channel
  include Api::MessagesHelper

  def subscribed
    @conversation = Api::Conversation.find(params[:conversation])
    player = Api::Player.find_by(:conversation_id => @conversation.id, :user_id => current_user.id)
    if !player
      reject
      return
    end

    broadcast_message({ :conversation_id => @conversation.id, :user_id => 6, :name => "Game Room", :text => "#{current_user.first_name} #{current_user.last_name} just joined the game" })
    player = Api::Player.find_by(:conversation_id => @conversation.id, :user_id => current_user.id)
    player.setStatus(:active)
    player.broadcast
    stream_for @conversation
  end

  def unsubscribed
    @conversation = Api::Conversation.find(params[:conversation])
    player = Api::Player.find_by(:conversation_id => @conversation.id, :user_id => current_user.id)
    player.setStatus(:logged_out)
    broadcast_message({ :conversation_id => @conversation.id, :user_id => 6, :name => "Game Room", :text => "#{current_user.first_name} #{current_user.last_name} just left the game" })
  end
end
