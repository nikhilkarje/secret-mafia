# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_23_094252) do

  create_table "api_users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "conversations", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "total_players", default: 5, null: false
    t.integer "players_joined", default: 0, null: false
  end

  create_table "messages", force: :cascade do |t|
    t.string "text"
    t.integer "conversation_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "api_user_id", default: 1, null: false
    t.index ["api_user_id"], name: "index_messages_on_api_user_id"
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
  end

  create_table "players", force: :cascade do |t|
    t.string "status", default: "logged_out", null: false
    t.string "secret_team_role", default: "liberal", null: false
    t.string "secret_special_role"
    t.string "public_role", default: "default", null: false
    t.integer "conversation_id", null: false
    t.integer "api_user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "pending_action", default: "none", null: false
    t.index ["api_user_id"], name: "index_players_on_api_user_id"
    t.index ["conversation_id"], name: "index_players_on_conversation_id"
  end

  add_foreign_key "messages", "api_users"
  add_foreign_key "messages", "conversations"
  add_foreign_key "players", "api_users"
  add_foreign_key "players", "conversations"
end
