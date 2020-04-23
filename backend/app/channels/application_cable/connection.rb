module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def session
      cookies.encrypted[Rails.application.config.session_options[:key]]
    end

    def find_verified_user
      puts session.inspect
      if session && session["user_id"] && verified_user = Api::User.find(session["user_id"])
        verified_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
