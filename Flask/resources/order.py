'''
Order routes
'''

from flask import jsonify, request
from flask_restful_swagger_2 import Resource, swagger
from flask_jwt_extended import jwt_required, get_jwt_identity

from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist, ValidationError, InvalidQueryError
from resources.errors import SchemaValidationError, InternalServerError, UnauthorizedError

from database.models import Order, CartItem, Product, User

class OrdersApi(Resource):
	@swagger.doc({
		'tags': ['Order'],
		'description': 'Get all orders according to search criteria',
		'responses': {
			'200': {
				'description': 'Array of Orders',
			}
		}
	})
	@jwt_required()
	def get(self):
		orders = Order.objects
		mappedOrders = list(map(lambda p: p.serialize(), orders))
		return jsonify(mappedOrders)
	@swagger.doc({
		'tags': ['Order'],
		'description': 'Add new product',
		'parameters': [
			{
				'name': 'products',
				'description': 'A list of CartItem',
				'in': 'body',
				'type': 'object',
				'schema': None,
				'required': True
			}
		],
		'responses': {
			'200': {
				'description': 'Order added',
			}
		}
	})
	@jwt_required(optional=True)
	def post(self):
		try:
			body = request.get_json()
			items = body.get('products')
			products = []
			for item in items:
				product = Product.objects.get(id=item['id'])
				products.append(CartItem(product=product, qty=item['qty']))
			order = Order(orderer=get_jwt_identity(), orderStatus='not placed', addresses=body.get('addresses'), products=products)
			order.save()
			id = order.id
			return {'id': str(id)}, 200
		except (FieldDoesNotExist, ValidationError):
			raise SchemaValidationError
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError


class OrderApi(Resource):
	@swagger.doc({
		'tags': ['Order'],
		'description': 'Get the order. Orders with non signed in users are only presented the order status for shipping concerns.',
		'parameters': [
			{
				'name': 'id',
				'description': 'The item id',
				'in': 'path',
				'type': 'string',
				'required': True
			}
		],
		'responses': {
			'200': {
				'description': 'The order',
			}
		}
	})
	@jwt_required(optional=True)
	def get(self, id):
		if (get_jwt_identity()):
			product = Order.objects.get(id=id, orderer=get_jwt_identity())
			return jsonify(product.serialize())
		else:
			product = Order.objects.get(id=id)
			return { 'orderStatus': product.orderStatus }