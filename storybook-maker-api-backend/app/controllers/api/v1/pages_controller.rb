module Api
  module V1
    class PagesController < ApplicationController
      before_action :find_page, only: [:show, :update, :destroy]
      def index
        @pages = Page.all
        render json: @pages
      end

      def show
      end

      def create
        @page = Page.create(page_params)
        render json: @page
      end

      def update
        @page.update(page_params)
        render json: @page
      end

      def destroy
        @pages = Page.all
        @page.destroy
        render json: @pages
      end

      private
      def find_page
        @page = Page.find(params[:id])
      end

      def page_params
        params.permit(:content, :img_url, :book_id, :user_id)
      end
    end
  end
end
