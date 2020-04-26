class GameWorkerJob < ApplicationJob
  include Api::MessagesHelper
  include Api::ConversationsHelper
  queue_as :default

  def start_game_validate
    if @conversation.players_joined < @conversation.total_players || @conversation.game
      return false
    elsif player = @players.find_by(:status => Api::Player.status_option[:logged_out])
      GameWorkerJob.set(wait: 10.seconds).perform_later("start_game", Api::ConversationSerializer.new(@conversation).attributes)
      return false
    end
    return true
  end

  def assign_roles
    facist_indexes = rand_n(2, @conversation.total_players)
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
      player.setPendingAction(:role)
      player.save
    end
    liberal_players.each do |player|
      player.setPendingAction(:role)
      player.save
    end
  end

  def start_election
    elections = @game.elections
    if elections.length
      last_election = elections.last
    end
    if !last_election
      president_index = rand_n(1, conversation.total_players)
      current_president = @players[president_index]
    else
      last_president = Api::Player.find(last_election.president)
      last_chancellor = Api::Player.find(last_election.chancellor)
      last_president.public_role = "default"
      last_chancellor.public_role = "default"
      last_president.save
      last_chancellor.save
      current_president = last_president.next
    end
    # current_president = Api::Player.find(1)
    election = Api::Election.new({ :game_id => @game.id, :president => current_president.id })
    election.save
    broadcast_room_message(@payload[:id], "#{current_president.name} is the new President candidate")
    current_president.public_role = "president"
    current_president.setPendingAction(:president)
    current_president.save
  end

  def reorder_policy
    policy_order = @game.policy_order
    max = 17 - policy_order.length
    n = 6 - policy_order.count("0")
    new_policy_order = generate_policy_order(n, max)
    @game.policy_order += new_policy_order
  end

  def reveal_team
    facist_players = @players.where(:secret_team_role => "facist")
    secret_hitler = @players.where(:secret_special_role => "hitler")
    liberal_players = @players.where(:secret_team_role => "liberal")
    message = "Team Facist: "
    facist_players.each do |player|
      if player.id == secret_hitler.id
        message += "#{player.name} (Secret Hitler) "
      else
        message += "#{player.name} "
      end
    end
    broadcast_room_message(@payload[:id], message)
    message = "Team Liberal: "
    liberal_players.each do |player|
      message += "#{player.name} "
    end
    broadcast_room_message(@payload[:id], message)
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
    facist_policies = @game.policy_passed.count("1")
    if facist_policies > 3
      secret_hitler = @players.where(:secret_special_role => "hitler")
      if @election.chancellor == secret_hitler.id
        broadcast_room_message(@payload[:id], "Secret Hitler has been voted as Chancellor. Facists win.")
        reveal_team
        return true
      end
    end
    return false
  end

  def reset_election_tracker
    if @game.election_tracker != 0
      @game.election_tracker = 0
    end
  end

  def policy_draw
    @election.policy_draw = @game.policy_order[0..2]
    @game.policy_order = @game.policy_order[3..-1]
  end

  def check_doomsday
    if @game.election_tracker >= 3
      @game.election_tracker = 0
      @game.policy_passed = @game.policy_order[0]
      @game.policy_order = @game.policy_order[1..-1]
      broadcast_room_message(@payload[:id], "Three elections failed in a row. Frustrated populace enacted a #{@game.policy_passed == "0" ? "Liberal" : "Facist"} policy")
    end
  end

  def perform(type, payload)
    # Do something later
    @payload = payload
    @conversation = Api::Conversation.find(@payload[:id])
    @players = @conversation.players
    case type
    when "start_game"
      if start_game_validate
        broadcast_room_message(@payload[:id], "Game is about to begin")
        assign_roles
      end
    when "start_election"
      @game = @conversation.game
      start_election
    when "start_voting"
      @players.each do |player|
        player.setPendingAction(:vote)
        player.save
      end
    when "election_results"
      @game = @conversation.game
      @election = @game.elections.find_by(:election_status => "active")

      if @game.policy_order.length < 3
        reorder_policy
      end
      if is_aye?
        return if hitler_as_chancellor?
        broadcast_room_message(@payload[:id], "The proposed government is established. Assembly is now in session")
        reset_election_tracker
        policy_draw
        president = @players.find(@election.president)
        president.setPendingAction(:policy_draw_president)
        broadcast_room_message(@payload[:id], "The president draws three policy and will pass two for the chancellor")
        @game.save
        president.save
      else
        @game.election_tracker += 1
        @election.election_status = "failed"
        broadcast_room_message(@payload[:id], "The proposed government has failed")
        check_doomsday
        @game.save
        @election.save
        start_election
      end
    when "end_election"
      @game = @conversation.game
      liberal_policies = @game.policy_passed.count("0")
      facist_policies = @game.policy_passed.count("1")
      if liberal_policies >= 5
        broadcast_room_message(@payload[:id], "Five Liberal policies are enacted. Liberals win.")
        reveal_team
      elsif facist_policies >= 6
        broadcast_room_message(@payload[:id], "Six Facist policies are enacted. Facists win.")
        reveal_team
      else
        start_election
      end
    end
  end
end
