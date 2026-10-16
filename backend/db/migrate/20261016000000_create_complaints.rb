class CreateComplaints < ActiveRecord::Migration[7.2]
  def change
    create_table :complaints, id: false do |table|
      table.string :id, primary_key: true
      table.text :content, null: false
      table.string :title, null: false
      table.text :summary, null: false
      table.string :category, null: false
      table.string :subcategory, null: false
      table.string :priority, null: false
      table.integer :confidence, null: false
      table.string :sentiment, null: false
      table.json :keywords, null: false, default: []
      table.string :owner, null: false
      table.string :response_due, null: false
      table.json :next_actions, null: false, default: []
      table.json :similar_cases, null: false, default: []
      table.string :customer, null: false, default: "New customer"
      table.string :channel, null: false, default: "Web"
      table.string :status, null: false, default: "New"
      table.text :resolution

      table.timestamps
    end

    add_index :complaints, :created_at
    add_index :complaints, :priority
    add_index :complaints, :status
    add_index :complaints, :category
  end
end
