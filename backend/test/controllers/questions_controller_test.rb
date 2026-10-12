require "test_helper"

class QuestionsControllerTest < ActionDispatch::IntegrationTest
  # Test for the index action
  test "should get index" do
    get questions_url
    assert_response :success
    assert_select "h1", "Questions Index"  # Adjust according to your actual view content
  end

  # Test for the create action
  test "should create question" do
    assert_difference('Question.count') do
      post questions_url, params: { question: { question: "What is Ruby on Rails?" } }
    end
    assert_redirected_to questions_path
    follow_redirect!
    assert_response :success
    assert_select "p", "Question was successfully asked."  # Adjust according to your actual view content
  end
end
