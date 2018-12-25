class User < ApplicationRecord
  has_many :books
  has_many :pages, through: :books
end
