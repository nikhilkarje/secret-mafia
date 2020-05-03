require "test_helper"
include Api::ConversationsHelper

class Api::GameFlowLiberalTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:user2)
    sign_in_as(@api_user)
    @conversation = api_conversations(:liberal)
    @election = api_elections(:liberal)
    @player = @conversation.players.find_by(:user_id => @api_user.id)
  end

  test "should win by 5 liberal policies" do
    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_chancellor_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :policy => @election.policy_picked[0] }
    end
    @conversation.reload
    assert_response :success
    assert_equal 5, @conversation.policy_passed.count("0")
    assert_equal @conversation.total_players, Api::Player.where(:conversation_id => @conversation.id, :pending_action => "end_game").count
  end

  test "should win by 6 facist policies" do
    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_chancellor_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :policy => @election.policy_picked[1] }
    end
    @conversation.reload
    assert_response :success
    assert_equal 6, @conversation.policy_passed.count("1")
    assert_equal @conversation.total_players, Api::Player.where(:conversation_id => @conversation.id, :pending_action => "end_game").count
  end
end
