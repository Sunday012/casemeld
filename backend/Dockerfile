# Use an official Ruby image from the Docker Hub
FROM ruby:3.3.4

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the Gemfile and Gemfile.lock to the working directory
COPY Gemfile Gemfile.lock ./

# Install the required Ruby gems
RUN bundle install

# Copy the rest of the application code
COPY . .

RUN chmod +x bin/*

# Expose port 3000 to the outside world
EXPOSE 3001

# Precompile assets if needed (optional, since no DB)
# RUN bundle exec rake assets:precompile

ENTRYPOINT ["./bin/docker-entrypoint"]

# Puma reads Render's PORT environment variable through config/puma.rb.
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
