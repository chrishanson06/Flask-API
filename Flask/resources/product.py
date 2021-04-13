'''
Movie routes
'''

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist, ValidationError, InvalidQueryError
from resources.errors import SchemaValidationError, InternalServerError, UnauthorizedError

from database.models import Product, User

class ProductsApi(Resource):
	'''
	Get all products according to search criteria
	'''
	@jwt_required()
	def get(self):
		products = Product.objects
		return jsonify(products)
	'''
	Add new product
	'''
	@jwt_required()
	def post(self):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			product = Product(**request.get_json())
			product.save()
			id = product.id
			return {'id': str(id)}, 200
		except (FieldDoesNotExist, ValidationError):
			raise SchemaValidationError
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError


class ProductApi(Resource):
	'''
	Update product
	'''
	@jwt_required()
	def put(self, id):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			product = Product.objects.get(id=id)
			product.update(**request.get_json())
			return 'ok', 200
		except InvalidQueryError:
			raise SchemaValidationError
		except DoesNotExist:
			raise UpdatingMovieError
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError       
	'''
	Delete product
	'''
	@jwt_required()
	def delete(self, id):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.admin:
				raise UnauthorizedError
			product = Product.objects.get(id=id)
			product.delete()
			return 'ok', 200
		except DoesNotExist:
			raise DeletingMovieError
		except UnauthorizedError:
			raise UnauthorizedError
		except Exception:
			raise InternalServerError