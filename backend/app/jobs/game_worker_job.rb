class GameWorkerJob < ApplicationJob
  include Api::MessagesHelper
  queue_as :default

  def start_game_validate
    if @conversation.players_joined < @conversation.total_players
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
      player.save
      player.broadcast_role_action
    end
    liberal_players.each do |player|
      player.broadcast_role_action
    end
  end

  def generate_policy_order
    liberal_indexes = rand_n(6, 17)
    policy_order = ""
    17.times { |index| policy_order += liberal_indexes.include?(index) ? "0" : "1" }
    policy_order
  end

  def broadcast_room_message(text)
    broadcast_message({ :conversation_id => @payload[:id], :user_id => 6, :name => "Game Room", :text => text })
  end

  def perform(type, payload)
    # Do something later
    @payload = payload
    @conversation = Api::Conversation.find(@payload[:id])
    @players = @conversation.players
    case type
    when "start_game"
      if start_game_validate
        broadcast_room_message("Game is about to begin")
        assign_roles
      end
    when "start_election"
      game = Api::Game.find_by(:conversation_id => @conversation.id)
      if !game
        game = Api::Game.new({ :conversation_id => @conversation.id, :policy_order => generate_policy_order })
        game.save
      end
      elections = game.elections
      if elections.length
        last_election = elections.where(:election_status => "passed").last
      end
      # if !last_election
      #   president_index = rand_n(1, conversation.total_players)
      #   current_president = @players[president_index]
      # else
      #   last_president = Api::Player.find(last_election.president)
      #   current_president = last_president.next
      # end
      current_president = Api::Player.find(1)
      election = Api::Election.new({ :game_id => game.id, :president => current_president.id })
      election.save
      president_user = current_president.user
      broadcast_room_message("#{president_user.first_name} #{president_user.last_name} is the new President candidate")
      current_president.broadcast_president_action
    end
  end
end
