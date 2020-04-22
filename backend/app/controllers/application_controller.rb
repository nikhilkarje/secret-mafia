class ApplicationController < ActionController::Base
  include ApplicationHelper
  before_action :check_authenticated

  def index
    bootstrap_javascript
    render :index, :layout => false
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
