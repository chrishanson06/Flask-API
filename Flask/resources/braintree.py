'''
Stripe routes
'''

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from resources.errors import InternalServerError

from resources.utils import calculate_order_amount

import braintree

from app import braintreeGateway

import json

class BraintreeClientTokenApi(Resource):
	'''
	Get the client token
	'''
	@jwt_required(optional=True)
	def get(self):
		id = get_jwt_identity()
		if id:
			return { 'clientToken': braintreeGateway.client_token.generate({'customer_id': id}) }
		else:
			return { 'clientToken': braintreeGateway.client_token.generate() }
	'''
	Post the nonce
	'''
	def post(self):
		nonce = request.form['payment_method_nonce']
		items = json.loads(request.form['items'])
		deviceData = json.loads(request.form['deviceData'])
		result = braintreeGateway.transaction.sale({
			'amount': calculate_order_amount(items) / 100,
			'payment_method_nonce': nonce,
			'device_data': deviceData,
			'options': {
            	"submit_for_settlement": True
        	}
		})
		if result.is_success or result.transaction:
			return 'ok', 200
		else:
			raise InternalServerError