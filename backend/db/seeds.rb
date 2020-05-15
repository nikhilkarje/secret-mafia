# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Api::User.create([{ :first_name => "Nikhil", :last_name => "Karje", :email => "n@k.com", :password => "gangotri", :role => "admin" }, { :first_name => "Game", :last_name => "Bot", :email => "g@b.com", :password => "gangotri", :role => "game_bot" }])
