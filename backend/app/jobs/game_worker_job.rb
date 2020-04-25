class GameWorkerJob < ApplicationJob
  include Api::MessagesHelper
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

  def rand_n(n, max)
    randoms = Set.new
    loop do
      randoms << rand(max)
      return randoms.to_a if randoms.size == n
    end
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

  def generate_policy_order(n = 6, max = 17)
    liberal_indexes = rand_n(n, max)
    policy_order = ""
    max.times { |index| policy_order += liberal_indexes.include?(index) ? "0" : "1" }
    policy_order
  end

  def start_election
    elections = @game.elections
    if elections.length
      last_election = elections.last
    end
    if !last_election
      president_index = rand_n(1, conversation.total_players)
      # current_president = @players[president_index]
    else
      last_president = Api::Player.find(last_election.president)
      last_chancellor = Api::Player.find(last_election.chancellor)
      last_president.public_role = "default"
      last_chancellor.public_role = "default"
      last_president.save
      last_chancellor.save
      # current_president = last_president.next
    end
    current_president = Api::Player.find(1)
    election = Api::Election.new({ :game_id => @game.id, :president => current_president.id })
    election.save
    president_user = current_president.user
    broadcast_room_message(@payload[:id], "#{president_user.first_name} #{president_user.last_name} is the new President candidate")
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
      if !@game
        @game = Api::Game.new({ :conversation_id => @conversation.id, :policy_order => generate_policy_order })
        @game.save
      end
      start_election
    when "start_voting"
      @players.each do |player|
        player.setPendingAction(:vote)
        player.save
      end
    when "election_results"
      @game = @conversation.game
      election = @game.elections.find_by(:election_status => "active")
      votes = election.votes
      total_ayes = votes.where(:ballot => true)
      total_nayes = votes.where(:ballot => false)
      broadcast_room_message(@payload[:id], "Election results are in")
      total_ayes.each do |vote|
        user = vote.player.user
        broadcast_room_message(@payload[:id], "#{user.first_name} #{user.last_name} voted Ja")
      end
      total_nayes.each do |vote|
        user = vote.player.user
        broadcast_room_message(@payload[:id], "#{user.first_name} #{user.last_name} voted Nein")
      end
      if total_ayes.length > total_nayes.length
        broadcast_room_message(@payload[:id], "The proposed government is established. Assembly is now in session")
        if @game.election_tracker != 0
          @game.election_tracker = 0
        end
        election.election_status = "session"
        if @game.policy_order.length < 3
          reorder_policy
        end
        election.policy_draw = @game.policy_order[0..2]
        @game.policy_order = @game.policy_order[3..-1]
        president = @players.find(election.president)
        president.setPendingAction(:policy_draw_president)
        broadcast_room_message(@payload[:id], "The president draws three policy and will pass two for the chancellor")
        @game.save
        election.save
        president.save
      else
        @game.election_tracker += 1
        election.election_status = "failed"
        broadcast_room_message(@payload[:id], "The proposed government has failed")
        # TODO: Implement doomsday

        @game.save
        election.save
        start_election
      end
    end
  end
end
