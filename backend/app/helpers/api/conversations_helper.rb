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
end
