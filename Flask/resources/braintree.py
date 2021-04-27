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
	Post the nonce and pay
	'''
	def post(self):
		body = request.get_json()
		nonce = body.get('payment_method_nonce')
		print(nonce)
		items = body.get('items')
		amount = calculate_order_amount(items)
		print(amount)
		#deviceData = json.loads(body.get('deviceData'))
		result = braintreeGateway.transaction.sale({
			'amount': str(amount),
			'payment_method_nonce': nonce,
		#	'device_data': deviceData,
			'options': {
            	"submit_for_settlement": True
        	}
		})
		print(result)
		if result.is_success or result.transaction:
			return 'ok', 200
		else:
			raise InternalServerError

class BraintreeWebhookApi(Resource):
	def post(self):
		webhook_notification = braintreeGateway.webhook_notification.parse(str(request.form['bt_signature']), request.form['bt_payload'])

		# Example values for webhook notification properties
		print(webhook_notification.kind) # "subscription_went_past_due"
		print(webhook_notification.timestamp) # "Sun Jan 1 00:00:00 UTC 2012"

		return Response(status=200)