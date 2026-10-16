module Api
  module V1
    class ComplaintsController < ApplicationController
      before_action :set_complaint, only: %i[update destroy]

      def index
        complaints = Complaint.order(created_at: :desc)
        render json: { complaints: complaints.map { |complaint| serialize(complaint) } }
      end

      def create
        complaint = Complaint.new(complaint_attributes)
        if complaint.save
          render json: { complaint: serialize(complaint) }, status: :created
        else
          render_validation_errors(complaint)
        end
      end

      def update
        if @complaint.update(complaint_attributes)
          render json: { complaint: serialize(@complaint) }
        else
          render_validation_errors(@complaint)
        end
      end

      def destroy
        @complaint.destroy!
        head :no_content
      end

      private

      def set_complaint
        @complaint = Complaint.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Case not found." }, status: :not_found
      end

      def complaint_attributes
        permitted = params.require(:complaint).permit(
          :content, :title, :summary, :category, :subcategory, :priority,
          :confidence, :sentiment, :owner, :responseDue, :customer, :channel,
          :status, :resolution, keywords: [], nextActions: [],
          similarCases: %i[id title category similarity resolution]
        )

        attributes = permitted.to_h
        attributes["response_due"] = attributes.delete("responseDue") if attributes.key?("responseDue")
        attributes["next_actions"] = attributes.delete("nextActions") if attributes.key?("nextActions")
        attributes["similar_cases"] = attributes.delete("similarCases") if attributes.key?("similarCases")
        attributes
      end

      def serialize(complaint)
        {
          id: complaint.id,
          content: complaint.content,
          title: complaint.title,
          summary: complaint.summary,
          category: complaint.category,
          subcategory: complaint.subcategory,
          priority: complaint.priority,
          confidence: complaint.confidence,
          sentiment: complaint.sentiment,
          keywords: complaint.keywords,
          owner: complaint.owner,
          responseDue: complaint.response_due,
          nextActions: complaint.next_actions,
          similarCases: complaint.similar_cases,
          customer: complaint.customer,
          channel: complaint.channel,
          status: complaint.status,
          resolution: complaint.resolution,
          createdAt: complaint.created_at.iso8601
        }
      end

      def render_validation_errors(complaint)
        render json: { error: complaint.errors.full_messages.to_sentence }, status: :unprocessable_entity
      end
    end
  end
end
