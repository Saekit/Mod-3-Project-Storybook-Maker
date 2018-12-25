# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'
#
# User.destroy_all
# Book.destroy_all
# Page.destroy_all

5.times do
  User.create!(username: Faker::Internet.unique.username)
end

@user_ids = User.pluck(:id)

5.times do |i|
  Book.create(name: Faker::Book.title, genre: Faker::Book.genre, user_id: @user_ids[i])
end

@book_ids = Book.pluck(:id)

20.times do |i|
  Page.create(content: Faker::Lorem.paragraph, img_url: "test", book_id: @book_ids[i], user_id: @user_ids[i])
end
puts "done"
