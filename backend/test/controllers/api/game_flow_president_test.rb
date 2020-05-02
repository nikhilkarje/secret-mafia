require "test_helper"
include Api::ConversationsHelper

class Api::GameFlowElectionTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:user1)
    sign_in_as(@api_user)
    @conversation = api_conversations(:game)
    @players = @conversation.players.filter_by_active
    @player = @players.find_by(:user_id => @api_user.id)
    @election = api_elections(:game)
    @player.set_president(@election.id)
  end

  test "should get pending action for new president" do
    get api_conversation_player_pending_action_url({ player_id: @player.id, conversation_id: @conversation.id })
    assert_response :success
    response = JSON.parse(@response.body)
    assert_equal "presidental_conferrence", response["type"]
    assert_equal @conversation.total_players - 1, response["data"].length
    current_player = nil
    for player in response["data"]
      if player["id"] == @player.id
        current_player = player
        break
      end
    end
    assert_nil current_player
  end

  # test "should get pending action for liberal roles" do
  #   liberal = @players.find_by(:secret_team_role => "liberal")
  #   sign_in_as(liberal.user)
  #   get api_conversation_player_pending_action_url({ player_id: liberal.id, conversation_id: @conversation.id })
  #   assert_response :success
  #   response = JSON.parse(@response.body)
  #   assert_equal "liberal_conferrence", response["type"]
  #   assert_nil response["data"]
  # end

  # test "should confirm role" do
  #   assert_difference(@players.where(:pending_action => "none")) do
  #     post api_conversation_player_confirm_role_url({ player_id: @player.id, conversation_id: @conversation.id })
  #   end
  #   assert_response :success
  #   assert_equal "none", Api::Player.find(@player.id).pending_action
  # end

  # test "should start election" do
  #   assert_difference("Api::Election.where({ :conversation_id => #{@conversation.id}}).count") do
  #     confirm_roles
  #   end
  #   assert_equal 0, @players.where(:pending_action => "confirm_role").length
  #   president = @players.find_by(:public_role => "president")
  #   assert_not_nil president
  #   assert_equal "choose_chancellor", president.pending_action
  # end
end
