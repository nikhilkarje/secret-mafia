require "test_helper"
include Api::ConversationsHelper

class Api::GameFlowRoleTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:user1)
    sign_in_as(@api_user)
    @conversation = api_conversations(:role)
    @players = @conversation.players.filter_by_active
    @player = @players.find_by(:user_id => @api_user.id)
  end

  test "should get pending action for facist roles" do
    hitler = @players.find_by(:secret_special_role => "hitler")
    sign_in_as(hitler.user)
    get api_conversation_player_pending_action_url({ player_id: hitler.id, conversation_id: @conversation.id })
    assert_response :success
    response = JSON.parse(@response.body)
    assert_equal "facist_conferrence", response["type"]
    assert_equal no_facist(@conversation.total_players), response["data"].length
    for facist in response["data"]
      if facist["secret_special_role"]
        assert_equal hitler.id, facist["id"]
      end
      assert_equal "facist", @players.find(facist["id"]).secret_team_role
    end
  end

  test "should get pending action for liberal roles" do
    liberal = @players.find_by(:secret_team_role => "liberal")
    sign_in_as(liberal.user)
    get api_conversation_player_pending_action_url({ player_id: liberal.id, conversation_id: @conversation.id })
    assert_response :success
    response = JSON.parse(@response.body)
    assert_equal "liberal_conferrence", response["type"]
    assert_nil response["data"]
  end

  test "should confirm role" do
    assert_difference("@players.where(:pending_action => 'none').count") do
      post api_conversation_player_confirm_role_url({ player_id: @player.id, conversation_id: @conversation.id })
    end
    assert_response :success
    assert_equal "none", Api::Player.find(@player.id).pending_action
  end

  test "should start election" do
    assert_difference("Api::Election.where({ :conversation_id => #{@conversation.id}}).count") do
      confirm_roles
    end
    assert_equal 0, @players.where(:pending_action => "confirm_role").length
    election = Api::Election.last
    president = election.president
    assert_not_nil president
    assert_equal "choose_chancellor", president.pending_action
  end
end
