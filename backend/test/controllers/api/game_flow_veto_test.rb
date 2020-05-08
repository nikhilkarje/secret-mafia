require "test_helper"
include Api::ConversationsHelper

def reload_all
  @conversation.reload
  @election.reload
  @player.reload
end

class Api::GameFlowVetoTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:user2)
    sign_in_as(@api_user)
    @conversation = api_conversations(:veto)
    @election = api_elections(:veto)
    @player = @conversation.players.find_by(:user_id => @api_user.id)
  end

  test "should enable chancellor to veto the policy" do
    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_veto_url({ player_id: @player.id, conversation_id: @conversation.id })
    end
    assert_response :success
    @player.reload
    assert_equal 5, @conversation.policy_passed.count("1")
    assert_equal "none", @player.pending_action
    @player = @election.president
    check_pending_action("confirm_veto", "confirm_veto", @election.policy_picked)
    assert_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      assert_difference("@conversation.election_tracker") do
        post api_conversation_player_confirm_veto_url({ player_id: @player.id, conversation_id: @conversation.id }),
          :params => { :confirm_veto => true }
        reload_all
      end
    end
    assert_response :success
    assert_equal "none", @player.pending_action
    assert_equal "failed", @election.election_status
    assert_nil @player.president_id
  end

  test "should enable president to deny the veto" do
    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_veto_url({ player_id: @player.id, conversation_id: @conversation.id })
    end
    @player = @election.president
    check_pending_action("confirm_veto", "confirm_veto", @election.policy_picked)
    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_confirm_veto_url({ player_id: @player.id, conversation_id: @conversation.id }),
        :params => { :confirm_veto => false }
    end
    assert_response :success
    @player.reload
    @election.reload
    assert_equal "none", @player.pending_action

    @player = @election.chancellor
    check_pending_action("policy_draw_chancellor_forced", "chancellors_choice", @election.policy_picked)
    post api_conversation_player_veto_url({ player_id: @player.id, conversation_id: @conversation.id })
    assert_response 401

    assert_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_chancellor_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :policy => @election.policy_picked[0] }
    end
    assert_response :success
    reload_all
    assert_equal @election.policy_picked[0], @conversation.policy_passed.last
    assert_equal "passed", @election.election_status
    assert_not_equal "policy_draw_chancellor", @player.pending_action
  end
end
