'''
Cart operation routes
'''

from flask import jsonify, request
from flask_restful_swagger_2 import Resource, swagger
from flask_jwt_extended import jwt_required, get_jwt_identity

from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist, ValidationError, InvalidQueryError
from resources.errors import SchemaValidationError, InternalServerError, UnauthorizedError

from database.models import User, Product, CartItem

class CartApi(Resource):
	'''
	Get the current user's cart
	'''
	@swagger.doc({
		'tags': ['Cart'],
		'description': 'Get the current user\'s cart',
		'responses': {
			'200': {
				'description': 'The users cart',
			}
		}
	})
	@jwt_required()
	def get(self):
		user = User.objects.get(id=get_jwt_identity())
		products = list(map(lambda p: p.serialize(), user.cart))
		return jsonify(products)
	@swagger.doc({
		'tags': ['Cart'],
		'description': 'Update the current user\'s cart',
		'parameters': [
			{
				'name': 'cart',
				'description': 'An array of CartItem',
				'in': 'body',
				'type': 'string',
				'schema': None,
				'required': True
			}
		],
		'responses': {
			'200': {
				'description': 'Cart updated',
			}
		}
	})
	@jwt_required()
	def put(self):
		user = User.objects.get(id=get_jwt_identity())
		pairs = request.get_json()
		cart = [None] * len(pairs)
		for i in range(0, len(pairs)):
			product = Product.objects.get(id=pairs[i]['id'])
			qty = pairs[i]['qty']
			cart[i] = {
				'product': product,
				'qty': qty
			}
		user.update(cart=cart)
		user.save()
		return 'ok', 200