require 'faker'

Page.destroy_all
Book.destroy_all
User.destroy_all

10.times do
  User.create!(username: Faker::Internet.unique.username)
end

@user_ids = User.pluck(:id)

30.times do
  Book.create!(title: Faker::Book.title, user_id: @user_ids.sample)
end

@book_ids = Book.pluck(:id)

60.times do
  Page.create!(content: Faker::Lorem.paragraph, img_url: Faker::LoremPixel.image, book_id: @book_ids.sample, user_id: @user_ids.sample)
end
puts "done"
