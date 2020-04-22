class SessionsController < ActionController::Base
  include ApplicationHelper

  def new
    if session[:user_id]
      redirect_to :root
    else
      bootstrap_javascript
      render :new, :layout => false
    end
  end

  def create
    user = Api::User.find_by_email(params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json: { :status => 200 }, :status => 200
    else
      render json: { :status => 400, :message => "Email or password is invalid" }, :status => 400
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to :root
  end
end
