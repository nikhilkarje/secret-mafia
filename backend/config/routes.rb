Rails.application.routes.draw do
  namespace :api do
    resources :users
  end
  namespace :channel do
    resources :conversations, only: [:index, :show, :create]
    resources :messages, only: [:create]
  end
  mount ActionCable.server => "/cable"
  get "/login", to: "sessions#new"
  post "/login", to: "sessions#create"
  get "/logout", to: "sessions#destroy"
  get "/admin", to: "application#admin"
  get "/room/:room_id", to: "application#index"
  root "application#index"
end
