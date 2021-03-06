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
    temp_hash = { "5" => 2, "6" => 2, "7" => 3, "8" => 3, "9" => 4, "10" => 4 }
    temp_hash["#{total_players}"]
  end

  def facist_power_broadcast_hash
    { :kill => "The President must kill a player",
      :examine_deck => "The President examines the top 3 cards",
      :examine_player => "The President investigates a player's identity card",
      :choose_president => "The President picks the next presidential candidate" }
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
    secret_hitler = @players.find_by(:secret_special_role => "hitler")
    liberal_players = @players.where(:secret_team_role => "liberal")
    message = "Team Fascist: "
    facist_players.each do |player|
      if player.id == secret_hitler.id
        message += "#{player.name} (Secret Hitler) "
      else
        message += "#{player.name} "
      end
    end
    broadcast_room_message(@conversation.id, message, "default")
    message = "Team Liberal: "
    liberal_players.each do |player|
      message += "#{player.name} "
    end
    broadcast_room_message(@conversation.id, message, "default")
  end

  def nominate_president(player)
    election = Api::Election.new({ :conversation_id => @conversation.id, :president_id => player.id })
    election.save
    player.set_president(election.id)
  end

  def check_doomsday
    if @conversation.election_tracker >= 3
      @conversation.election_tracker = 0
      @conversation.policy_passed += @conversation.policy_order[0]
      @conversation.policy_order = @conversation.policy_order[1..-1]
      broadcast_room_message(@conversation.id, "Three elections failed in a row. Frustrated populace enacted a #{@conversation.policy_passed.last == "0" ? "Liberal" : "Fascist"} policy", "#{@conversation.policy_passed.last == "0" ? "success" : "error"}")
    end
  end

  def fail_election
    @conversation.election_tracker += 1
    @election.election_status = "failed"
    check_doomsday
  end
end
