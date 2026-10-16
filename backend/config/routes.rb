# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :questions, only: [:index, :create]
      resources :complaints, only: [:index, :create, :update, :destroy]
    end
  end
end
