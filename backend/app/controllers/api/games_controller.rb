class Api::GamesController < ApplicationController
  def index
    player = Api::Player.find_by(:conversation_id => params[:conversation_id], :user_id => session[:user_id])
    if player
      render json: player.conversation.game
      return
    end
    render json: {}, status: 401
  end
end
