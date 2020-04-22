Rails.application.routes.draw do
  namespace :api do
    resources :users
  end
  namespace :channel do
    resources :conversations, only: [:index, :show, :create] do
      resources :players, only: [:index, :create]
    end
    resources :messages, only: [:create]
  end
  mount ActionCable.server => "/cable"
  get "/login", to: "sessions#new"
  post "/login", to: "sessions#create"
  get "/logout", to: "sessions#destroy"
  get "/admin", to: "application#admin"
  get "/room/:room_id", to: "application#room"
  root "application#index"
end
