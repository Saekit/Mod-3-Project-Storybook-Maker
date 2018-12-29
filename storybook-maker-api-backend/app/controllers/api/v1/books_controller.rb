module Api
  module V1
    class BooksController < ApplicationController
      before_action :find_book, only: [:show, :update, :destroy]
      def index
        @books = Book.all
        render json: @books
      end

      def show
      end

      def create
        @book = Book.create(book_params)
        render json: @book
      end

      def update
        @book.update(book_params)
        render json: @book
      end

      def destroy
        @books = Book.all
        @book.destroy
        render json: @books
      end

      private
      def find_book
        @book = Book.find(params[:id])
      end

      def book_params
        params.permit(:title, :user_id, :contents, :img_url)
      end
    end
  end
end
