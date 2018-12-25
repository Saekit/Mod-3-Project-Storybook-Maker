module Api
  module V1
    class UsersController < ApplicationController
      def index
        @users = User.all
        render json: @users
      end

      def create
        @user = User.create(user_params)
        render json: @user
      end

      def update
        @user = User.find(params[:id])
        @user.update(user_params)
        render json: @user
      end

      def destroy
        @users = User.all
        @user = User.find(params[:id])
        @user.destroy
        render json: @users
      end

      def user_params
        params.permit(:username)
      end
    end
  end
end
