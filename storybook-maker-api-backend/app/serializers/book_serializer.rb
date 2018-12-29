class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :pages, :user
end
