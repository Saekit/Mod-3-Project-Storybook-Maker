class BookSerializer < ActiveModel::Serializer
  attributes :id, :name, :pages, :user
end
