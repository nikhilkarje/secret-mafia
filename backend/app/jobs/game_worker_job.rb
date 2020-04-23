class GameWorkerJob < ApplicationJob
  include Channel::MessagesHelper
  queue_as :default

  def start_game_validate
    if @conversation.players_joined < @conversation.total_players
      return false
    elsif player = @players.find_by(:status => Channel::Player.status_option[:logged_out])
      GameWorkerJob.set(wait: 10.seconds).perform_later("start_game", Channel::ConversationSerializer.new(@conversation).attributes)
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
        players.secret_team_role = "facist"
        facist_players << player
      else
        liberal_players << player
      end
    end
    facist_players[hitler_index].secret_special_role = "hitler"
    facist_players.each do |player|
      player.save
      player.private_facist_broadcast(facist_players)
    end
    liberal_players.each do |player|
      player.private_liberal_broadcast
    end
  end

  def perform(type, payload)
    # Do something later
    @payload = payload
    case type
    when "start_game"
      @conversation = Channel::Conversation.find(@payload[:id])
      @players = @conversation.players
      if start_game_validate
        broadcast_message({ :conversation_id => @payload[:id], :api_user_id => 6, :text => "Game is about to begin" })
        assign_roles
      end
    end
  end
end
