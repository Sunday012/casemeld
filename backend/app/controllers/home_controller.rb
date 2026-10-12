class HomeController < ApplicationController
  def index
    render json: { message: "Rails backend is working!" }
  end
end
