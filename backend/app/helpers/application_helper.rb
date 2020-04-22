module ApplicationHelper
  def bootstrap_javascript
    @bootstrap_javascript = "<script type=\"text/javascript\">window.config = #{config_json.to_json};</script>"
  end

  def config_json
    {
      user_id: session[:user_id],
    }
  end
end
