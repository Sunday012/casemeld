module Api
  module V1
    class QuestionsController < ApplicationController
      def create
        question_text = params[:question].to_s.squish
        unless question_text.length.between?(30, 2_400)
          return render json: { error: "Complaint must be between 30 and 2,400 characters." }, status: :bad_request
        end

        openai_client = OpenAI::Client.new(access_token: ENV.fetch("OPENAI_API_KEY"))

        embedding_response = openai_client.embeddings(parameters: {
          model: "text-embedding-3-large",
          input: question_text
        })

        embedding = embedding_response.dig("data", 0, "embedding")

        return render json: { error: "Embedding service returned no result." }, status: :unprocessable_entity if embedding.blank?

        result = PineconeService.new.query(embedding)
        matches = Array(result["matches"]).filter_map do |match|
          metadata = JSON.parse(match.dig("metadata", "text").to_s)
          {
            id: match["id"],
            similarity: match["score"],
            complaint_what_happened: metadata["complaint_what_happened"],
            issue: metadata["issue"],
            sub_issue: metadata["sub_issue"],
            product: metadata["product"],
            tags: metadata["tags"]
          }
        rescue JSON::ParserError
          nil
        end

        render json: { question: question_text, results: matches }, status: :ok
      rescue KeyError
        Rails.logger.error("Complaint analysis service is missing required configuration")
        render json: { error: "Analysis service is not configured." }, status: :service_unavailable
      rescue StandardError => error
        Rails.logger.error("Complaint analysis failed: #{error.class}")
        render json: { error: "Analysis is temporarily unavailable." }, status: :bad_gateway
      end
    end
  end
end
