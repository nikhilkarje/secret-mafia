require "test_helper"
include Api::ConversationsHelper

class Api::GameFlowHitlerTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:user5)
    sign_in_as(@api_user)
    @conversation = api_conversations(:chancellor)
    @election = api_elections(:chancellor)
    @player = @conversation.players.find_by(:user_id => @api_user.id)
  end

  test "should win by electing hitler as chancellor" do
    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      cast_votes @player, true
    end
    assert_response :success
    assert_equal 3, @conversation.policy_passed.count("1")
    assert_equal @conversation.total_players, Api::Player.where(:conversation_id => @conversation.id, :pending_action => "end_game").count
  end
end
