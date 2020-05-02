require "test_helper"

class Api::ConversationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:user1)
    sign_in_as(@api_user)
    @conversation = api_conversations(:one)
  end

  test "should get index" do
    get api_conversations_url
    assert_response :success
    conversations = JSON.parse(@response.body)
    conversation = conversations[0]
    assert_includes conversations, JSON.parse(Api::ConversationSerializer.new(@conversation).to_json)
    assert_equal @conversation["title"], conversation["title"]
    assert_nil conversation["messages"]
  end

  test "should not show api_conversation for un-joined user" do
    @api_user = api_users(:other)
    sign_in_as(@api_user)
    get api_conversation_url(@conversation)
    assert_response 401
  end

  test "should create api_user" do
    assert_difference("Api::Conversation.count") do
      post api_conversations_url, params: { conversation: { title: @conversation.title } }
    end
    assert_response :success
    conversation = JSON.parse(@response.body)
    assert_equal @conversation["title"], conversation["title"]
    assert_nil conversation["messages"]
  end
end
