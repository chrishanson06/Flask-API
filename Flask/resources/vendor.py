'''
Vendor routes
'''

from flask import jsonify, request
from flask_restful_swagger_2 import Resource, swagger
from flask_jwt_extended import jwt_required, get_jwt_identity

from resources.errors import InternalServerError, UnauthorizedError, SchemaValidationError

from database.models import Vendor, User

class MyVendorsApi(Resource):
	@swagger.doc({
		'tags': ['Vendor'],
		'description': 'Get all vendor applications',
		'responses': {
			'200': {
				'description': 'Array of Vendor',
			}
		}
	})
	@jwt_required()
	def get(self):
		try:
			vendors = Vendor.objects(owner=get_jwt_identity())
			mappedVendors = list(map(lambda v: v.serialize()))
			return jsonify(mappedVendors)
		except Exception:
			raise InternalServerError
	@swagger.doc({
		'tags': ['Vendor'],
		'description': 'Submit a vendor application',
		'parameters': [
			{
				'name': 'Vendor',
				'description': 'A Vendor object',
				'in': 'body',
				'type': 'object',
				'schema': None,
				'required': False
			}
		],
		'responses': {
			'200': {
				'description': 'Vendor application submitted',
			}
		}
	})
	@jwt_required()
	def post(self):
		try:
			user = User.objects.get(id=get_jwt_identity())
			if not user.isVendor:
				vendor = Vendor(**request.get_json(), owner=user, status='applied')
				vendor.save()
				return 'ok', 200
			raise UnauthorizedError
		except Exception:
			raise InternalServerError

class MyVendorApi(Resource):
	@swagger.doc({
		'tags': ['Vendor'],
		'description': 'Get this user\'s active store',
		'responses': {
			'200': {
				'description': 'A Vendor object',
			}
		}
	})
	@jwt_required()
	def get(self):
		try:
			vendor = Vendor.objects.get(owner=get_jwt_identity(), status='accepted')
			return vendor.serialize()
		except Exception:
			raise InternalServerError
	@swagger.doc({
		'tags': ['Vendor'],
		'description': 'Update the current user\'s active store',
		'parameters': [
			{
				'name': 'Vendor',
				'description': 'A Vendor object',
				'in': 'body',
				'type': 'object',
				'schema': None,
				'required': False
			}
		],
		'responses': {
			'200': {
				'description': 'Store updated',
			}
		}
	})
	@jwt_required()
	def put(self):
		try:
			body = request.get_json()
			if body['slug'] or body['owner']:
				raise SchemaValidationError
			vendor = Vendor.objects.get(owner=get_jwt_identity(), status='accepted')
			vendor.update(**body)
			return 'ok', 200
		except Exception:
			raise InternalServerError
	@swagger.doc({
		'tags': ['Vendor'],
		'description': 'Deactivate this user\'s current active store',
		'responses': {
			'200': {
				'description': 'Store deactivated',
			}
		}
	})
	@jwt_required()
	def delete(self):
		try:
			vendor = Vendor.objects.get(owner=get_jwt_identity(), status='accepted')
			vendor.status = 'deactivated'
			vendor.save()
			return 'ok', 200
		except Exception:
			raise InternalServerError