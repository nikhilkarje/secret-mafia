require "test_helper"

class SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:test)
  end

  test "should get new for logged out user" do
    get login_url
    assert_response :success
  end

  test "should redirect new for logged in user" do
    sign_in_as(@api_user)
    get login_url
    assert_redirected_to :root
  end

  test "should get create" do
    post login_url, params: { email: @api_user.email, password: "password" }
    assert_response :success
  end

  test "should get destroy" do
    get logout_url
    assert_redirected_to :root
  end
end
