module Api::ConversationsHelper
  def generate_policy_order(n = 6, max = 17)
    liberal_indexes = rand_n(n, max)
    policy_order = ""
    max.times { |index| policy_order += liberal_indexes.include?(index) ? "0" : "1" }
    policy_order
  end

  def rand_n(n, max)
    randoms = Set.new
    loop do
      randoms << rand(max)
      return randoms.to_a if randoms.size == n
    end
  end

  def no_facist(total_players)
    temp_hash = { "5" => 2 }
    temp_hash["#{total_players}"]
  end

  def facist_power_broadcast_hash
    { :kill => "President must execute one player",
      :examine_deck => "President gets to examine top 3 cards from the deck",
      :examine_player => "President get to examine team identity of a player",
      :choose_president => "President must nominate another Player for next Presidential election" }
  end

  def facist_power_list
    [:kill, :examine_deck, :examine_player, :choose_president]
  end

  def facist_power_hash
    common_power = {
      "4" => facist_power_list[0],
      "5" => facist_power_list[0],
    }
    third_step_power = {
      "3" => facist_power_list[1],
    }.merge(common_power)
    second_step_power = {
      "2" => facist_power_list[2],
      "3" => facist_power_list[3],
    }.merge(common_power)
    first_step_power = { "1" => facist_power_list[2] }.merge(second_step_power)
    facist_power = {
      "5" => third_step_power,
      "6" => third_step_power,
      "7" => second_step_power,
      "8" => second_step_power,
      "9" => first_step_power,
      "10" => first_step_power,
    }
    facist_power
  end

  def reveal_team
    @players = @conversation.players
    @players.each do |player|
      player.set_pending_action(:end_game)
    end

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

  def nominate_president(player)
    election = Api::Election.new({ :conversation_id => @conversation.id })
    election.save
    player.set_president(election.id)
  end

  def check_doomsday
    if @conversation.election_tracker >= 3
      @conversation.election_tracker = 0
      @conversation.policy_passed += @conversation.policy_order[0]
      @conversation.policy_order = @conversation.policy_order[1..-1]
      broadcast_room_message(@conversation.id, "Three elections failed in a row. Frustrated populace enacted a #{@conversation.policy_passed == "0" ? "Liberal" : "Facist"} policy")
    end
  end

  def fail_election
    @conversation.election_tracker += 1
    @election.election_status = "failed"
    check_doomsday
  end
end
