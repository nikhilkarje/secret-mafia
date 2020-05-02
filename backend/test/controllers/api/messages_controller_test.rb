require "test_helper"

class Api::MessagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:user1)
    sign_in_as(@api_user)
    @conversation = api_conversations(:one)
  end

  test "should create messages" do
    assert_difference("Api::Message.count") do
      post api_messages_url, params: { message: { :text => "Wassup", :user_id => @api_user.id, :conversation_id => @conversation.id } }
    end
    assert_response :success
    message = Api::Message.last
    assert_equal "Wassup", message.text
    assert_equal "#{@api_user.first_name} #{@api_user.last_name}", message.name
  end
end
