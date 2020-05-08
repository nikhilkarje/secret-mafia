module ApplicationHelper
  def bootstrap_javascript
    @bootstrap_javascript = "<script type=\"text/javascript\">window.config = #{config_json.to_json};</script>"
  end

  def config_json
    {
      user_id: session[:user_id],
    }
  end

  def check_admin
    if (!session[:user_id]) || Api::User.find(session[:user_id]).role != "admin"
      respond_to do |format|
        format.html { redirect_to root }
        format.json { render json: { :status => 401 }, :status => 401 }
      end
    end
  end
end
