class Complaint < ApplicationRecord
  PRIORITIES = %w[Critical High Medium Low].freeze
  STATUSES = ["New", "In review", "Escalated", "Resolved"].freeze
  SENTIMENTS = ["Very negative", "Negative", "Neutral"].freeze
  CHANNELS = %w[Email Web Phone Social].freeze

  before_validation :assign_case_id, on: :create

  validates :content, length: { in: 30..2_400 }
  validates :title, :summary, :category, :subcategory, :owner, :response_due, presence: true
  validates :confidence, inclusion: { in: 0..100 }
  validates :priority, inclusion: { in: PRIORITIES }
  validates :status, inclusion: { in: STATUSES }
  validates :sentiment, inclusion: { in: SENTIMENTS }
  validates :channel, inclusion: { in: CHANNELS }

  private

  def assign_case_id
    self.id ||= loop do
      candidate = "CM-#{SecureRandom.random_number(900_000) + 100_000}"
      break candidate unless self.class.exists?(candidate)
    end
  end
end
