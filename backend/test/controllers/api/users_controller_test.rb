require 'test_helper'

class Api::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @api_user = api_users(:one)
  end

  test "should get index" do
    get api_users_url
    assert_response :success
  end

  test "should get new" do
    get new_api_user_url
    assert_response :success
  end

  test "should create api_user" do
    assert_difference('Api::User.count') do
      post api_users_url, params: { api_user: { email: @api_user.email, first_name: @api_user.first_name, last_name: @api_user.last_name, password_digest: @api_user.password_digest } }
    end

    assert_redirected_to api_user_url(Api::User.last)
  end

  test "should show api_user" do
    get api_user_url(@api_user)
    assert_response :success
  end

  test "should get edit" do
    get edit_api_user_url(@api_user)
    assert_response :success
  end

  test "should update api_user" do
    patch api_user_url(@api_user), params: { api_user: { email: @api_user.email, first_name: @api_user.first_name, last_name: @api_user.last_name, password_digest: @api_user.password_digest } }
    assert_redirected_to api_user_url(@api_user)
  end

  test "should destroy api_user" do
    assert_difference('Api::User.count', -1) do
      delete api_user_url(@api_user)
    end

    assert_redirected_to api_users_url
  end
end
