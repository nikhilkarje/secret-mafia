require "test_helper"

module GameSetupHelper
  def setup
    @api_user = api_users(:user1)
    sign_in_as(@api_user.email, "password")
    conversation = api_conversations(:one)
    join_players(conversation, 4)
    @conversation = Api::Conversation.find(conversation.id)
    @players = @conversation.players.filter_by_active
    @player = Api::Player.find_by(:conversation_id => @conversation.id, :user_id => @api_user.id)
  end

  setup()
end
