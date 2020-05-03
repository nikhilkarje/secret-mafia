require "test_helper"
include Api::ConversationsHelper

def reload_all
  @conversation.reload
  @election.reload
  @player.reload
end

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

  test "should let president choose chancellor" do
    choose_chancellor
    assert_response :success
    chancellor = @election.chancellor
    assert_not_nil chancellor
    assert_equal @conversation.total_players, @conversation.players.filter_by_active.where(:pending_action => "vote").count
  end

  test "should get pending action for voting" do
    choose_chancellor
    get api_conversation_player_pending_action_url({ player_id: @player.id, conversation_id: @conversation.id })
    assert_response :success
    response = JSON.parse(@response.body)
    chancellor = @election.chancellor
    assert_equal "election_day", response["type"]
    assert_equal JSON.parse(Api::PlayerSerializer.new(chancellor).to_json), response["data"]
  end

  test "should be able to cast vote" do
    choose_chancellor
    assert_difference("Api::Vote.where({ :election_id => #{@election.id}}).count") do
      post api_conversation_player_cast_vote_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :ballot => true }
    end
    assert_response :success
    post api_conversation_player_cast_vote_url({ player_id: @player.id, conversation_id: @conversation.id }),
         :params => { :ballot => true }
    assert_response 401
  end

  test "should fail the government" do
    choose_chancellor
    assert_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      assert_difference("@conversation.election_tracker") do
        @conversation.players.filter_by_active.each_with_index { |player, index| cast_votes player, index > 2 }
        @conversation.reload
      end
    end
    assert_equal "failed", Api::Election.find(@election.id).election_status
    president = Api::Election.last.president
    next_player = @player.next_active
    assert_equal president, next_player
  end

  test "should pass the government" do
    # Choose chancellor
    choose_chancellor
    # Cast vote
    assert_no_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      @conversation.players.filter_by_active.each_with_index { |player, index| cast_votes player, index < 3 }
    end
    @election.reload
    @conversation.reload
    assert_equal "active", @election.election_status
    assert_equal 0, @conversation.election_tracker
    assert_equal 3, @election.policy_draw.length
    assert_equal 14, @conversation.policy_order.length
    president = @election.president
    # Pending action of president
    @player = president
    response = check_pending_action("policy_draw_president", "presidential_choice", @election.policy_draw)
    # President chooses two policies
    post api_conversation_player_presidential_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
         :params => { :policy => @election.policy_draw[0..1] }
    assert_response :success
    reload_all
    assert_equal @election.policy_draw[0..1], @election.policy_picked
    assert_equal @election.policy_draw[2], @conversation.discard_pile
    chancellor = @election.chancellor
    assert_equal "none", @player.pending_action
    # Pending action of chancellor
    @player = chancellor
    response = check_pending_action("policy_draw_chancellor", "chancellors_choice", @election.policy_picked)
    # Chancellor chooses one policy
    assert_difference("Api::Election.where(:conversation_id => #{@conversation.id}).count") do
      post api_conversation_player_chancellor_policy_url({ player_id: @player.id, conversation_id: @conversation.id }),
           :params => { :policy => @election.policy_picked[0] }
    end
    assert_response :success
    reload_all
    assert_equal @election.policy_picked[0], @conversation.policy_passed
    assert_equal @election.policy_picked[1], @conversation.discard_pile.last
    assert_equal "passed", @election.election_status
    assert_equal "none", @player.pending_action
    president.reload
    assert_nil president.president_id
    assert_nil @player.chancellor_id
    assert_not_nil president.next_active.president_id
  end
end
