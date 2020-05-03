class GameWorkerJob < ApplicationJob
  include Api::MessagesHelper
  include Api::ConversationsHelper
  queue_as :default

  def start_game_validate
    if @conversation.players_joined < @conversation.total_players
      return false
    end
    return true
  end

  def assign_roles
    facist_indexes = rand_n(no_facist(@conversation.total_players), @conversation.total_players)
    hitler_index = rand_n(1, facist_indexes.length)[0]
    facist_players = []
    liberal_players = []
    @players.each_with_index do |player, index|
      if facist_indexes.include?(index)
        player.secret_team_role = "facist"
        facist_players << player
      else
        liberal_players << player
      end
    end
    facist_players[hitler_index].secret_special_role = "hitler"
    facist_players.each do |player|
      player.set_pending_action(:confirm_role)
    end
    liberal_players.each do |player|
      player.set_pending_action(:confirm_role)
    end
  end

  def start_election
    elections = @conversation.elections
    if elections.length
      last_election = elections.last
    end
    if !last_election
      president_index = rand_n(1, @conversation.total_players)
      current_president = @players[president_index[0]]
    else
      last_president = last_election.president
      last_chancellor = last_election.chancellor
      last_president.set_president(nil)
      last_chancellor.set_chancellor(nil)
      current_president = last_president.next_active
    end
    # current_president = Api::Player.find(1)
    nominate_president(current_president)
    broadcast_room_message(@payload[:id], "#{current_president.name} is the new President candidate")
  end

  def reorder_policy
    policy_order = @conversation.policy_order
    max = 17 - policy_order.length
    n = 6 - policy_order.count("0")
    new_policy_order = generate_policy_order(n, max)
    @conversation.policy_order += new_policy_order
  end

  def is_aye?
    votes = @election.votes
    total_ayes = votes.where(:ballot => true)
    total_nayes = votes.where(:ballot => false)
    broadcast_room_message(@payload[:id], "Election results are in")
    total_ayes.each do |vote|
      player = vote.player
      broadcast_room_message(@payload[:id], "#{player.name} voted Ja")
    end
    total_nayes.each do |vote|
      player = vote.player
      broadcast_room_message(@payload[:id], "#{player.name} voted Nein")
    end
    return total_ayes.length > total_nayes.length
  end

  def hitler_as_chancellor?
    facist_policies = @conversation.policy_passed.count("1")
    if facist_policies > 3
      secret_hitler = @players.find_by(:secret_special_role => "hitler")
      if @election.chancellor_id == secret_hitler.id
        broadcast_room_message(@payload[:id], "Secret Hitler has been voted as Chancellor. Facists win.")
        reveal_team
        return true
      end
    end
    return false
  end

  def reset_election_tracker
    if @conversation.election_tracker != 0
      @conversation.election_tracker = 0
    end
  end

  def policy_draw
    @election.policy_draw = @conversation.policy_order[0..2]
    @conversation.policy_order = @conversation.policy_order[3..-1]
  end

  def check_executive_power
    last_policy = @conversation.policy_passed.last
    if last_policy == "1"
      facist_power = facist_power_hash["#{@conversation.total_players}"]["#{@conversation.policy_passed.count("1")}"]
      if facist_power
        president = @conversation.elections.last.president
        president.set_pending_action(facist_power)
        broadcast_room_message(@payload[:id], facist_power_broadcast_hash[facist_power])
        return true
      end
    end
    return false
  end

  def perform(type, payload)
    # Do something later
    @payload = payload
    @conversation = Api::Conversation.find(@payload[:id])
    @players = @conversation.players.filter_by_active
    case type
    when "start_game"
      if start_game_validate
        broadcast_room_message(@payload[:id], "Game is about to begin")
        assign_roles
      end
    when "start_election"
      start_election
    when "start_voting"
      @players.each do |player|
        player.set_pending_action(:vote)
      end
    when "election_results"
      @election = @conversation.elections.find_by(:election_status => "active")
      if @conversation.policy_order.length < 3
        reorder_policy
      end
      if is_aye?
        return if hitler_as_chancellor?
        broadcast_room_message(@payload[:id], "The proposed government is established. Assembly is now in session")
        reset_election_tracker
        policy_draw
        president = @election.president
        broadcast_room_message(@payload[:id], "The president draws three policy and will pass two for the chancellor")
        @conversation.save
        @election.save
        president.set_pending_action(:policy_draw_president)
      else
        broadcast_room_message(@payload[:id], "The proposed government has failed")
        fail_election
        @conversation.save
        @election.save
        start_election
      end
    when "end_election"
      liberal_policies = @conversation.policy_passed.count("0")
      facist_policies = @conversation.policy_passed.count("1")
      if liberal_policies >= 5
        broadcast_room_message(@payload[:id], "Five Liberal policies are enacted. Liberals win.")
        reveal_team
      elsif facist_policies >= 6
        broadcast_room_message(@payload[:id], "Six Facist policies are enacted. Facists win.")
        reveal_team
      elsif !check_executive_power
        start_election
      end
    end
  end
end
