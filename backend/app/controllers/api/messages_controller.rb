class Api::MessagesController < ApplicationController
  include Api::MessagesHelper

  # TODO: Authenticate
  def create
    user = Api::User.find(message_params[:user_id])
    if broadcast_message(message_params.merge({ :name => "#{user.first_name} #{user.last_name}" }))
      head :ok
    end
  end

  private

  def message_params
    params.require(:message).permit(:text, :conversation_id, :user_id)
  end
end
