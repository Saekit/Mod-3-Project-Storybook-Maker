# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'

Page.destroy_all
Book.destroy_all
User.destroy_all

5.times do
  User.create!(username: Faker::Internet.unique.username)
end

@user_ids = User.pluck(:id)

5.times do |i|
  Book.create(title: Faker::Book.title, user_id: @user_ids[i])
end

@book_ids = Book.pluck(:id)

20.times do |i|
  Page.create(content: Faker::Lorem.paragraph, img_url: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb", book_id: @book_ids[i], user_id: @user_ids[i])
end
puts "done"
