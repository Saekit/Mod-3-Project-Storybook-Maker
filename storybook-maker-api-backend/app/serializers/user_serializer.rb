class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :books, :pages
end
