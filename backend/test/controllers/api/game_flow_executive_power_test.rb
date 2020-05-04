require "test_helper"
include Api::ConversationsHelper

class Api::GameFlowExecutivePowerTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:user2)
    sign_in_as(@api_user)
  end

  test "should enable deck examination power for president" do
    @conversation = api_conversations(:deck)
    @election = api_elections(:deck)
    @player = @conversation.players.find_by(:user_id => @api_user.id)

    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_chancellor_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :policy => @election.policy_picked[0] }
    end
    @conversation.reload
    assert_response :success
    assert_equal 3, @conversation.policy_passed.count("1")
    @player = @election.president
    check_pending_action("examine_deck", "examine_deck", @conversation.policy_order[0..2])
    assert_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_confirm_deck_url({ player_id: @player.id, conversation_id: @conversation.id })
    end
    assert_response :success
    @player.reload
    assert_equal "none", @player.pending_action
  end

  test "should enable president to execute a player" do
    @conversation = api_conversations(:deck)
    @conversation.policy_passed += "1"
    @conversation.save
    @election = api_elections(:deck)
    @player = @conversation.players.find_by(:user_id => @api_user.id)

    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_chancellor_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :policy => @election.policy_picked[0] }
    end
    @conversation.reload
    assert_response :success
    assert_equal 4, @conversation.policy_passed.count("1")
    @player = @election.president
    dead_player = api_players(:deck_player3)
    serialized_data = JSON.parse(ActiveModel::Serializer::CollectionSerializer.new(@conversation.players.where.not(:id => @player.id), each_serializer: Api::PlayerSerializer).to_json)
    check_pending_action("kill", "kill", serialized_data)
    assert_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_kill_player_url({ :player_id => @player.id, :conversation_id => @conversation.id }),
        :params => { :dead_player_id => dead_player.id }
    end
    assert_response :success
    @player.reload
    dead_player.reload
    assert_equal "none", @player.pending_action
    assert_equal "dead", dead_player.status
  end

  test "should end when president kills hitler" do
    @conversation = api_conversations(:deck)
    @conversation.policy_passed += "1"
    @conversation.save
    @election = api_elections(:deck)
    @player = @conversation.players.find_by(:user_id => @api_user.id)

    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_chancellor_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :policy => @election.policy_picked[0] }
    end
    @player = @election.president
    sign_in_as(@player.user)
    dead_player = api_players(:deck_player5)
    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_kill_player_url({ player_id: @player.id, conversation_id: @conversation.id }),
        :params => { :dead_player_id => dead_player.id }
    end
    assert_response :success
    dead_player.reload
    assert_equal @conversation.total_players, Api::Player.where(:conversation_id => @conversation.id, :pending_action => "end_game").count
    assert_equal "dead", dead_player.status
  end

  test "should enable president to examine a player" do
    @conversation = api_conversations(:examine_player)
    @election = api_elections(:examine_player)
    @player = @conversation.players.find_by(:user_id => @api_user.id)

    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_chancellor_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :policy => @election.policy_picked[0] }
    end
    @conversation.reload
    assert_response :success
    assert_equal 2, @conversation.policy_passed.count("1")
    @player = @election.president
    investigated_player = api_players(:examine_player5)
    serialized_data = JSON.parse(ActiveModel::Serializer::CollectionSerializer.new(@conversation.players.where.not(:id => @player.id), each_serializer: Api::PlayerSerializer).to_json)
    check_pending_action("examine_player", "examine_player", serialized_data)
    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_examine_player_url({ :player_id => @player.id, :conversation_id => @conversation.id }),
        :params => { :investigated_player_id => investigated_player.id }
    end
    assert_response :success
    @player.reload
    investigated_player.reload
    assert_equal "confirm_investigation", @player.pending_action
    assert_equal "investigated", investigated_player.status
    serialized_data = JSON.parse(Api::PlayerSerializer.new(investigated_player, :show_team => true).to_json)
    response = check_pending_action("confirm_investigation", "confirm_investigation", serialized_data)
    assert_equal "facist", response["data"]["secret_team_role"]
    assert_nil response["data"]["secret_special_role"]
    assert_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_confirm_investigation_url({ :player_id => @player.id, :conversation_id => @conversation.id })
    end
    assert_response :success
    @player.reload
    investigated_player.reload
    assert_equal "none", @player.pending_action
    assert_equal "active", investigated_player.status
  end

  test "should enable president to pick next president" do
    @conversation = api_conversations(:examine_player)
    @conversation.policy_passed += "1"
    @conversation.save
    @election = api_elections(:examine_player)
    @player = @conversation.players.find_by(:user_id => @api_user.id)

    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_chancellor_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :policy => @election.policy_picked[0] }
    end
    @conversation.reload
    assert_response :success
    assert_equal 3, @conversation.policy_passed.count("1")
    @player = @election.president
    candidate_player = api_players(:examine_player5)
    chancellor = @election.chancellor
    serialized_data = JSON.parse(ActiveModel::Serializer::CollectionSerializer.new(@conversation.players.where.not(:id => @player.id), each_serializer: Api::PlayerSerializer).to_json)
    check_pending_action("choose_president", "choose_president", serialized_data)
    assert_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_choose_president_url({ :player_id => @player.id, :conversation_id => @conversation.id }),
        :params => { :president_id => candidate_player.id }
    end
    assert_response :success
    @player.reload
    candidate_player.reload
    chancellor.reload
    assert_equal "none", @player.pending_action
    assert_nil @player.president_id
    assert_nil chancellor.chancellor_id
    assert_equal Api::Election.last.id, candidate_player.president_id
  end
end
