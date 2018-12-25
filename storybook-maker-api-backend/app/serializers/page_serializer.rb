class PageSerializer < ActiveModel::Serializer
  attributes :id, :content, :img_url, :book, :user
end
