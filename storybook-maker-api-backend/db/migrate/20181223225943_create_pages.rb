class CreatePages < ActiveRecord::Migration[5.1]
  def change
    create_table :pages do |t|
      t.string :content
      t.string :img_url
      t.references :book, index: true
      t.references :user, index: true

      t.timestamps
    end
  end
end
