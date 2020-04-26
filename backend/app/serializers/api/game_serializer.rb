class Api::GameSerializer < ActiveModel::Serializer
  attributes :id, :election_tracker, :draw_pile, :discard_pile, :liberal_policy, :facist_policy

  def liberal_policy
    object.policy_passed.count("0")
  end

  def facist_policy
    object.policy_passed.count("1")
  end

  def draw_pile
    object.policy_order.length
  end

  def discard_pile
    object.discard_pile.length
  end
end
