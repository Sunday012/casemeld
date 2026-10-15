module Api
  module V1
    class QuestionsController < ApplicationController
      def create
        question_text = params[:question].to_s.squish
        unless question_text.length.between?(30, 2_400)
          return render json: { error: "Complaint must be between 30 and 2,400 characters." }, status: :bad_request
        end

        result = PineconeService.new.search(question_text)
        matches = Array(result.dig("result", "hits")).map do |hit|
          fields = hit.fetch("fields", {})
          {
            id: hit["_id"] || hit["id"],
            similarity: hit["_score"] || hit["score"],
            complaint_what_happened: fields["text"],
            issue: fields["issue"],
            sub_issue: fields["sub_issue"],
            product: fields["product"],
            tags: fields["tags"]
          }
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
