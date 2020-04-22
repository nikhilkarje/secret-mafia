class Api::User < ApplicationRecord
  has_secure_password
  validates :email, uniqueness: true, presence: true
  validates :first_name, presence: true
  validates :last_name, presence: true
end
