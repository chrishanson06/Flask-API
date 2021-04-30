'''
Admin routes
'''

from flask import jsonify, request, render_template
from flask_restful import Resource
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token, jwt_required, get_jwt_identity
import datetime

from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist
from jwt.exceptions import ExpiredSignatureError, DecodeError, InvalidTokenError
from resources.errors import SchemaValidationError, EmailAlreadyExistsError, UnauthorizedError, InternalServerError, EmailDoesnotExistsError, BadTokenError

from database.models import User, Order

class AdminApi(Resource):
	'''
	Get if current user is admin
	'''
	@jwt_required()
	def get(self):
		try:
			user = User.objects.get(id=get_jwt_identity())
			return user.admin
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError

class AdminUsersApi(Resource):
	'''
	Get all users
	'''
	@jwt_required()
	def get(self):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			users = User.objects
			return jsonify(users)
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError

class AdminUserApi(Resource):
	'''
	Get user
	'''
	@jwt_required()
	def get(self, id):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			user = User.objects.get(id=id)
			return jsonify(user)
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError
	'''
	Update user
	'''
	@jwt_required()
	def put(self, id):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			user = User.objects.get(id=request.params)
			user.update(**request.get_json())
			return 'ok'
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError
	'''
	Delete user
	'''
	@jwt_required()
	def delete(self, id):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			user = User.objects.get(id=request.params)
			user.delete()
			return 'ok'
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError
	
class AdminOrdersApi(Resource):
	'''
	Get all orders
	'''
	@jwt_required()
	def get(self):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			orders = Order.objects
			mappedOrders = list(map(lambda o: o.serialize(), orders))
			return jsonify(mappedOrders)
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError

class AdminOrderApi(Resource):
	'''
	Get order
	'''
	@jwt_required()
	def get(self, id):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			order = Order.objects.get(id=id)
			return jsonify(order)
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError
	'''
	Update order
	'''
	@jwt_required()
	def put(self, id):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			order = Order.objects.get(id=id)
			order.update(**request.get_json())
			return 'ok'
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError
	'''
	Delete order
	'''
	@jwt_required()
	def delete(self, id):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			order = Order.objects.get(id=id)
			order.delete()
			return 'ok'
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError