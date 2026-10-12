# Use an official Ruby image from the Docker Hub
FROM ruby:3.3.4

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential nodejs

# Set the working directory inside the container
WORKDIR /app

# Copy the Gemfile and Gemfile.lock to the working directory
COPY Gemfile Gemfile.lock ./

# Install the required Ruby gems
RUN bundle install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3001

# Precompile assets if needed (optional, since no DB)
# RUN bundle exec rake assets:precompile

# The command to start the Rails server
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]
