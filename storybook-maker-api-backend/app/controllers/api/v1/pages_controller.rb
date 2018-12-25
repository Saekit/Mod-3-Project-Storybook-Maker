module Api
  module V1
    class PagesController < ApplicationController
      def index
        @pages = Page.all
        render json: @pages
      end

      def create
        @page = Page.create(page_params)
        render json: @page
      end

      def update
        @page = Page.find(params[:id])
        @page.update(page_params)
        render json: @page
      end

      def destroy
        @pages = Page.all
        @page = Page.find(params[:id])
        @page.destroy
        render json: @pages
      end

      def page_params
        params.permit(:contents, :img_url, :book_id, :user_id)
      end
    end
  end
end
