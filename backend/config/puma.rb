max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

bind "unix:/tmp/sockets/puma.sock"

stdout_redirect "/var/log/puma.stdout.log", "/var/log/puma.stderr.log", true

port ENV.fetch("PORT") { 3000 }

environment ENV.fetch("RAILS_ENV") { "production" }

pidfile ENV.fetch("PIDFILE") { "/tmp/pids/server.pid" }

plugin :tmp_restart
