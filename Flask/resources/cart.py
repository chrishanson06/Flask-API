'''
Cart operation routes
'''

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist, ValidationError, InvalidQueryError
from resources.errors import SchemaValidationError, InternalServerError, UnauthorizedError

from database.models import User, Product



class CartApi(Resource):
	'''
	Get the current user's cart
	'''
	@jwt_required()
	def get(self):
		user = User.objects.get(id=get_jwt_identity())
		products = list(map(lambda p: p.serialize(), user.cart))
		return jsonify(products)
	'''
	Update the current user's cart
	'''
	@jwt_required()
	def put(self):
		user = User.objects.get(id=get_jwt_identity())
		print(request.get_json())
		return 'ok', 200