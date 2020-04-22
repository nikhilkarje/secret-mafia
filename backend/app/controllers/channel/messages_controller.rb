class Channel::MessagesController < ApplicationController
  include ApplicationHelper

  def show
    messages = Channel::Conversation.all
    render json: messages
  end

  def create
    if broadcast_message(message_params)
      head :ok
    end
  end

  private

  def message_params
    params.require(:message).permit(:text, :conversation_id, :api_user_id)
  end
end
