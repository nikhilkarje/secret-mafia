class ApplicationController < ActionController::Base
  include ApplicationHelper
  before_action :check_authenticated

  def index
    bootstrap_javascript
    player = Channel::Player.find_by(:api_user_id => session[:user_id])
    if player
      redirect_to "/room/#{player.conversation_id}"
      return
    end
    render :index, :layout => false
  end

  def room
    bootstrap_javascript
    player = Channel::Player.find_by(:conversation_id => params[:room_id], :api_user_id => session[:user_id])
    if player
      render :index, :layout => false
    else
      redirect_to root_path
    end
  end

  def admin
    bootstrap_javascript
    render :admin, :layout => false
  end

  def check_authenticated
    if (!session[:user_id])
      respond_to do |format|
        format.html { redirect_to login_path }
        format.json { render json: { :status => 401 }, :status => 401 }
      end
    end
  end
end
