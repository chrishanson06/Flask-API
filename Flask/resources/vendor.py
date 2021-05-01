'''
Vendor routes
'''

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from resources.errors import InternalServerError, UnauthorizedError, SchemaValidationError

from database.models import Vendor, User

class MyVendorsApi(Resource):
	'''
	Get all vendor applications for this user
	'''
	@jwt_required()
	def get(self):
		try:
			vendors = Vendor.objects(owner=get_jwt_identity())
			mappedVendors = list(map(lambda v: v.serialize()))
			return jsonify(mappedVendors)
		except Exception:
			raise InternalServerError
	'''
	Submit a vendor application
	'''
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
	'''
	Get this user's accepted vendor
	'''
	@jwt_required()
	def get(self):
		try:
			vendor = Vendor.objects.get(owner=get_jwt_identity(), status='accepted')
			return vendor.serialize()
		except Exception:
			raise InternalServerError
	'''
	Edit this user's active store
	'''
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
	'''
	Deactivate this user's active store
	'''
	@jwt_required()
	def delete(self):
		try:
			vendor = Vendor.objects.get(owner=get_jwt_identity(), status='accepted')
			vendor.status = 'deactivated'
			vendor.save()
			return 'ok', 200
		except Exception:
			raise InternalServerError