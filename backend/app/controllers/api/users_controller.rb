class Api::UsersController < ApplicationController
  include ApplicationHelper
  before_action :set_api_user, only: [:show, :edit, :update, :destroy]
  before_action :check_admin, except: [:create]
  skip_before_action :check_authenticated, :only => [:create]

  # GET /api/users
  def index
    @api_users = Api::User.all
    @api_users_hash = ActiveModel::Serializer::ArraySerializer.new(@api_users, each_serializer: Api::UserSerializer, show_email: true)
    respond_to do |format|
      format.html { render :index }
      format.json { render json: { :users => @api_users_hash } }
    end
  end

  # GET /api/users/1
  def show
  end

  # GET /api/users/new
  def new
    @api_user = Api::User.new
  end

  # GET /api/users/1/edit
  def edit
  end

  # POST /api/users
  def create
    @api_user = Api::User.new(api_user_params)

    if @api_user.save
      respond_to do |format|
        format.html { redirect_to @api_user, notice: "User was successfully created." }
        format.json { render json: { :user => @api_user }, :except => [:password_digest, :created_at, :updated_at] }
      end
    else
      respond_to do |format|
        format.html { render :new }
        format.json { render json: { :status => 400, :message => "Bad Request" }, :status => 400 }
      end
    end
  end

  # PATCH/PUT /api/users/1
  def update
    if @api_user.update(api_user_params)
      respond_to do |format|
        format.html { redirect_to @api_user, notice: "User was successfully updated." }
        format.json { render json: { :user => @api_user }, :except => [:password_digest, :created_at, :updated_at] }
      end
    else
      respond_to do |format|
        format.html { render :edit }
        format.json { render json: { :status => 400, :message => "Bad Request" }, :status => 400 }
      end
    end
  end

  # DELETE /api/users/1
  def destroy
    @api_user.destroy
    respond_to do |format|
      format.html { redirect_to api_users_url, notice: "User was successfully destroyed." }
      format.json { render json: { :status => 200 }, :status => 200 }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_api_user
    @api_user = Api::User.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def api_user_params
    params.require(:api_user).permit(:first_name, :last_name, :email, :password)
  end
end
