'''
Models to serialize between MongoDB and Python
'''

from .db import db
from flask_bcrypt import generate_password_hash, check_password_hash

import random, string

class CartItem(db.EmbeddedDocument):
	product = db.ReferenceField('Product')
	qty = db.IntField()

	def serialize(self):
		return {
			'product': self.product.serialize(),
			'qty': self.qty
		}

class User(db.Document):
	email = db.EmailField(required=True, unique=True)
	password = db.StringField(required=True, min_length=6)
	salt = db.StringField()
	admin = db.BooleanField()

	cart = db.ListField(db.EmbeddedDocumentField('CartItem'))

	def hash_password(self):
		chars = string.ascii_letters + string.punctuation
		size = 12
		self.salt = ''.join(random.choice(chars) for x in range(size))
		self.password = generate_password_hash(self.password + self.salt).decode('utf8')

	def check_password(self, password):
		return check_password_hash(self.password, password + self.salt)

	def serialize(self):
		mappedCart = list(map(lambda c: c.serialize(), self.cart))
		return {
			'id': str(self.pk),
			'email': self.email,
			'admin': True if self.admin else False,
			'cart': mappedCart
		}

class Product(db.Document):
	name = db.StringField()
	slug = db.StringField(unique=True)
	description = db.StringField()
	short_description = db.StringField()
	sku = db.StringField()
	price = db.DecimalField(precision=2)

	def serialize(self):
		return {
			'id': str(self.pk),
			'name': self.name,
			'slug': self.slug,
			'description': self.description,
			'shortDescription': self.shortDescription,
			'sku': self.sku,
			'price': float(self.price)
		}