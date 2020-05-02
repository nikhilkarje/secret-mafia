require "test_helper"

class Api::PlayersControllerTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper
  setup do
    @api_user = api_users(:user1)
    sign_in_as(@api_user)
    @conversation = api_conversations(:one)
  end

  test "should get index" do
    get api_conversation_players_url(@conversation)
    assert_response :success
    players = JSON.parse(@response.body)
    player = players[0]
    assert_equal 1, players.length
    assert_equal "#{@api_user.first_name} #{@api_user.last_name}", player["name"]
  end

  test "should not get index for unjoined player" do
    other_user = api_users(:other)
    sign_in_as(other_user)
    get api_conversation_players_url(@conversation)
    assert_response 401
  end

  test "should not create player for joined user" do
    post api_conversation_players_url(@conversation)
    assert_response 401
  end

  test "should create player for un-joined user" do
    @conversation = api_conversations(:create)
    join_players(@conversation, 3)
    other_user = api_users(:other)
    sign_in_as(other_user)
    assert_difference("Api::Player.count") do
      post api_conversation_players_url(@conversation)
    end
    assert_response :success
    player = JSON.parse(@response.body)
    @conversation = Api::Conversation.find(@conversation.id)
    # assert_equal @conversation.total_players, @conversation.players_joined
    assert_equal "#{other_user.first_name} #{other_user.last_name}", player["name"]
    assert_nil player["secret_special_role"]
    assert_nil player["secret_team_role"]
    facist_players = @conversation.players.where(:secret_team_role => "facist")
    assert_equal no_facist(@conversation.total_players), facist_players.length
    assert_equal 1, @conversation.players.where(:secret_special_role => "hitler").count
  end

  test "should not create player for full room" do
    @conversation.players_joined = @conversation.total_players
    post api_conversation_players_url(@conversation)
    assert_response 401
  end

  test "should not get pending action when role" do
    @conversation.players_joined = @conversation.total_players
    post api_conversation_players_url(@conversation)
    assert_response 401
  end

  # test "should show api_conversation" do
  #   get api_conversation_url(@conversation)
  #   assert_response :success
  #   conversation = JSON.parse(@response.body)
  #   assert_equal @conversation["title"], conversation["title"]
  #   assert_equal 2, conversation["messages"].length
  #   assert_nil conversation["policy_order"]
  #   assert_nil conversation["policy_passed"]
  #   assert_equal 0, conversation["discard_pile"]
  #   assert_equal 17, conversation["draw_pile"]
  # end
end
