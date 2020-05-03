require "test_helper"
include Api::ConversationsHelper

class Api::GameFlowDoomsdayTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:user5)
    sign_in_as(@api_user)
    @conversation = api_conversations(:failed)
    @election = api_elections(:failed)
    @player = @conversation.players.find_by(:user_id => @api_user.id)
  end

  test "should fail the government thrice" do
    assert_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      assert_difference("@conversation.policy_passed.length") do
        assert_difference("@conversation.policy_order.length", -1) do
          cast_votes @player, false
          @conversation.reload
          @election.reload
        end
      end
    end
    assert_equal 0, @conversation.election_tracker
    assert_equal "failed", @election.election_status
  end
end
