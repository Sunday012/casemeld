require "test_helper"

module Api
  module V1
    class ComplaintsControllerTest < ActionDispatch::IntegrationTest
      setup do
        @payload = {
          complaint: {
            content: "I was charged twice after cancelling and support has not returned my money.",
            title: "Duplicate charge issue",
            summary: "The customer reports a duplicate charge after cancellation.",
            category: "Billing & payments",
            subcategory: "Incorrect charge or payment",
            priority: "High",
            confidence: 92,
            sentiment: "Negative",
            keywords: ["charged", "cancelling", "refund"],
            owner: "Billing operations",
            responseDue: "2h",
            nextActions: ["Verify the transaction", "Issue the refund"],
            similarCases: [],
            customer: "New customer",
            channel: "Web",
            status: "New"
          }
        }
      end

      test "creates, lists, updates, and deletes a complaint" do
        assert_difference("Complaint.count", 1) do
          post api_v1_complaints_url, params: @payload, as: :json
        end
        assert_response :created
        case_id = response.parsed_body.dig("complaint", "id")

        get api_v1_complaints_url, as: :json
        assert_response :success
        assert_equal case_id, response.parsed_body.dig("complaints", 0, "id")

        patch api_v1_complaint_url(case_id), params: { complaint: { status: "Resolved" } }, as: :json
        assert_response :success
        assert_equal "Resolved", response.parsed_body.dig("complaint", "status")

        assert_difference("Complaint.count", -1) do
          delete api_v1_complaint_url(case_id), as: :json
        end
        assert_response :no_content
      end

      test "rejects invalid complaints" do
        post api_v1_complaints_url, params: { complaint: { content: "Too short" } }, as: :json
        assert_response :unprocessable_entity
      end
    end
  end
end
