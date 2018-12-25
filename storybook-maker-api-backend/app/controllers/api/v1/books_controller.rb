module Api
  module V1
    class BooksController < ApplicationController
      def index
        @books = Book.all
        render json: @books
      end

      def create
        @book = Book.create(book_params)
        render json: @book
      end

      def update
        @book = Book.find(params[:id])
        @book.update(book_params)
        render json: @book
      end

      def destroy
        @books = Book.all
        @book = Book.find(params[:id])
        @book.destroy
        render json: @books
      end

      def book_params
        params.permit(:name, :user_id)
      end
    end
  end
end
