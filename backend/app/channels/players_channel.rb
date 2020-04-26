class PlayersChannel < ApplicationCable::Channel
  include Api::MessagesHelper

  def subscribed
    @conversation = Api::Conversation.find(params[:conversation])
    player = Api::Player.find_by(:conversation_id => @conversation.id, :user_id => current_user.id)
    if !player
      reject
      return
    end

    player = Api::Player.find_by(:conversation_id => @conversation.id, :user_id => current_user.id)
    player.setStatus(:active)
    stream_for @conversation
  end

  def unsubscribed
    @conversation = Api::Conversation.find(params[:conversation])
    player = Api::Player.find_by(:conversation_id => @conversation.id, :user_id => current_user.id)
    player.setStatus(:logged_out)
  end
end
