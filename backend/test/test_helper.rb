ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...

  def sign_in_as(user)
    post login_url, params: { email: user.email, password: "password" }
  end

  def join_players(conversation, total, start_with = 2)
    puts "=============Here==================="
    count = start_with
    for value in Array.new(total)
      user = api_users("user#{count}".to_sym)
      sign_in_as(user)
      post api_conversation_players_url(conversation)
      count += 1
    end
  end

  def confirm_roles
    for player in @players
      api_user = player.user
      sign_in_as(api_user)
      post api_conversation_player_confirm_role_url({ player_id: player.id, conversation_id: @conversation.id })
    end
  end
end
