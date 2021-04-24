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
			'id': str(self.product.pk),
			'vendor': str(self.product.vendor.pk),
			'vendorImg': self.product.vendor.profileImg,
			'vendorName': self.product.vendor.name,
			'vendorSlug': self.product.vendor.slug,
			'name': self.product.name,
			'price': float(self.product.price),
			'qty': self.qty
		}

class User(db.Document):
	email = db.EmailField(required=True, unique=True)
	password = db.StringField(required=True, min_length=6)
	salt = db.StringField()
	admin = db.BooleanField()

	cart = db.ListField(db.EmbeddedDocumentField('CartItem'))
	isVendor = db.BooleanField()

	def hash_password(self):
		chars = string.ascii_letters + string.digits + string.punctuation
		size = 16
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
			'cart': mappedCart,
			'isVendor': self.isVendor
		}

class Vendor(db.Document):
	owner = db.ReferenceField('User')
	name = db.StringField()
	slug = db.StringField()
	profileImg = db.StringField()
	phoneNumber = db.StringField()
	email = db.EmailField()
	status = db.StringField() # Can be 'applied, 'pending', 'accepted', 'declined', 'deactivated'
	products = db.ListField(db.ReferenceField('Product'))

	def getProducts(self):
		mappedProducts = list(map(lambda p: p.serialize(), self.products))
		return mappedProducts

	def serialize(self):
		mappedProducts = list(map(lambda p: str(p.pk), self.products))
		return {
			'id': str(self.pk),
			'name': self.name,
			'slug': self.slug,
			'profileImg': self.profileImg,
			'status': self.status,
			'products': mappedProducts
		}

class Product(db.Document):
	name = db.StringField()
	description = db.StringField()
	shortDescription = db.StringField()
	sku = db.StringField()
	price = db.DecimalField(precision=2)
	vendor = db.ReferenceField('Vendor')

	def serialize(self):
		return {
			'id': str(self.pk),
			'name': self.name,
			'slug': self.slug,
			'description': self.description,
			'shortDescription': self.shortDescription,
			'sku': self.sku,
			'price': float(self.price),
			'vendor': self.vendor.serialize()
		}

class Order(db.Document):
	orderer = db.ReferenceField('User')
	orderStatus = db.StringField() # can be 'pending', 'processing', 'shipped', 'completed'
	products = db.ListField(db.EmbeddedDocumentField('CartItem'))

	def serialize(self):
		mappedProducts = list(map(lambda p: p.serialize(), self.products))
		return {
			'id': str(self.pk),
			'orderer': str(self.orderer.pk),
			'orderStatus': self.orderStatus,
			'products': mappedProducts
		}