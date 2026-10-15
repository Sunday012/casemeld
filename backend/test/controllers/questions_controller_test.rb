require "test_helper"

class QuestionsControllerTest < ActionDispatch::IntegrationTest
  test "rejects complaints that are too short" do
    post api_v1_questions_url, params: { question: "Too short" }, as: :json

    assert_response :bad_request
    assert_equal "Complaint must be between 30 and 2,400 characters.", response.parsed_body["error"]
  end

  test "returns related complaints from Pinecone" do
    complaint = "I was charged twice and support has not refunded the duplicate payment."
    search_result = {
      "result" => {
        "hits" => [
          {
            "_id" => "complaint-0000001",
            "_score" => 0.91,
            "fields" => {
              "text" => "A duplicate charge was not refunded.",
              "issue" => "Problem with a purchase shown on your statement",
              "sub_issue" => "Overcharged for something you did purchase with the card",
              "product" => "Credit card",
              "tags" => ""
            }
          }
        ]
      }
    }
    service = Minitest::Mock.new
    service.expect(:search, search_result, [complaint])

    PineconeService.stub(:new, service) do
      post api_v1_questions_url, params: { question: complaint }, as: :json
    end

    assert_response :success
    body = response.parsed_body
    assert_equal complaint, body["question"]
    assert_equal "complaint-0000001", body.dig("results", 0, "id")
    assert_equal 0.91, body.dig("results", 0, "similarity")
    service.verify
  end

  test "reports missing Pinecone configuration" do
    complaint = "I was charged twice and support has not refunded the duplicate payment."

    PineconeService.stub(:new, -> { raise KeyError, "PINECONE_HOST" }) do
      post api_v1_questions_url, params: { question: complaint }, as: :json
    end

    assert_response :service_unavailable
    assert_equal "Analysis service is not configured.", response.parsed_body["error"]
  end
end
