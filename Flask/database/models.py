'''
Models to serialize between MongoDB and Python
'''

from .db import db
from flask_bcrypt import generate_password_hash, check_password_hash

from datetime import datetime
import random, string

class User(db.Document):
	email = db.EmailField(required=True, unique=True)
	password = db.StringField(required=True, min_length=6)
	salt = db.StringField()
	admin = db.BooleanField()

	def hash_password(self):
		if not self.salt:
			chars = string.ascii_letters + string.punctuation
			size = 12
			self.salt = ''.join(random.choice(chars) for x in range(size))
		self.password = generate_password_hash(self.password + self.salt).decode('utf8')

	def check_password(self, password):
		return check_password_hash(self.password, password + self.salt)

	def serialize(self):
		return {
			'email': self.email,
			'admin': True if self.admin else False,
		}

class Product(db.Document):
	name = db.StringField()
	slug = db.StringField(unique=True)
	date_created = db.DateTimeField(default=datetime.utcnow)
	date_modified = db.DateTimeField()
	status = db.BooleanField()
	featured = db.BooleanField()
	catalog_visibility = db.StringField()
	description = db.StringField()
	short_description = db.StringField()
	sku = db.StringField()
	price = db.DecimalField(precision=2)
	regular_price = db.DecimalField(precision=2)
	sale_price = db.DecimalField(precision=2)
	date_on_sale_from = db.DateTimeField()
	date_on_sale_to = db.DateTimeField()
	total_sales = db.IntField()
	tax_status = db.StringField()
	tax_class = db.StringField()
	manage_stock = db.BooleanField()
	stock_quantity = db.IntField()
	stock_status = db.StringField()
	backorders = db.StringField()
	sold_individually = db.BooleanField()
	weight = db.IntField(min_value=0)
	weightUnits = db.StringField()
	length = db.IntField(min_value=0)
	width = db.IntField(min_value=0)
	height = db.IntField(min_value=0)
	dimensionUnits = db.StringField()
	virtual = db.BooleanField()
	reviews = db.ListField(db.ReferenceField('Review'), reverse_delete_rule=db.PULL)

class Review(db.Document):
	reviewer = db.ReferenceField('User')
	score = db.IntField(min_value=0, max_value=100, required=True)
	body = db.StringField()