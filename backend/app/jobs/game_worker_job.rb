class GameWorkerJob < ApplicationJob
  queue_as :default

  def perform(*args)
    # Do something later
    puts "===============Hey=============="
  end
end
