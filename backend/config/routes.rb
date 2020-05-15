Rails.application.routes.draw do
  namespace :api do
    resources :users
    resources :conversations, only: [:index, :show, :create] do
      resources :players, only: [:index, :create] do
        get "/pending_action", to: "players#pending_action"
        post "/confirm_role", to: "players#confirm_role"
        post "/confirm_chancellor", to: "players#confirm_chancellor"
        post "/cast_vote", to: "players#cast_vote"
        post "/presidential_policy", to: "players#presidential_policy"
        post "/chancellor_policy", to: "players#chancellor_policy"
        post "/confirm_deck", to: "players#confirm_deck"
        post "/kill_player", to: "players#kill_player"
        post "/examine_player", to: "players#examine_player"
        post "/confirm_investigation", to: "players#confirm_investigation"
        post "/choose_president", to: "players#choose_president"
        post "/veto", to: "players#veto"
        post "/confirm_veto", to: "players#confirm_veto"
        post "/end_game", to: "players#end_game"
      end
    end
    resources :messages, only: [:create]
  end
  mount ActionCable.server => "/cable"
  get "/login", to: "sessions#new"
  get "/create", to: "sessions#new"
  post "/login", to: "sessions#create"
  get "/logout", to: "sessions#destroy"
  get "/admin", to: "application#admin"
  get "/room/:room_id", to: "application#room"
  get "/trigger", to: "application#test"
  root "application#index"
end
