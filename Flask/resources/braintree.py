'''
Braintree routes
'''

from flask import jsonify, request
from flask_restful_swagger_2 import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from resources.errors import InternalServerError

from resources.utils import calculate_order_amount

from database.models import Order

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
	@jwt_required(optional=True)
	def post(self):
		body = request.get_json()
		nonce = body.get('payment_method_nonce')
		
		order = Order.objects.get(id=body.get('order'))
		billing = {
			'street_address': order.addresses['billing']['street1'],
			'extended_address': order.addresses['billing']['street2'],
			'locality': order.addresses['billing']['city'],
			'region': order.addresses['billing']['region'],
			'country_name': order.addresses['billing']['country'],
			'postal_code': order.addresses['billing']['zip']
		}
		shipping = {
			'street_address': order.addresses['shipping']['street1'],
			'extended_address': order.addresses['shipping']['street2'],
			'locality': order.addresses['shipping']['city'],
			'region': order.addresses['shipping']['region'],
			'country_name': order.addresses['shipping']['country'],
			'postal_code': order.addresses['shipping']['zip']
		}
		amount = calculate_order_amount(order.products)
		
		deviceData = json.loads(body.get('deviceData'))
		result = braintreeGateway.transaction.sale({
			'amount': str(amount),
			'payment_method_nonce': nonce,
			'device_data': deviceData['correlation_id'],
			'options': {
            	"submit_for_settlement": True
        	},
			'order_id': str(order.pk),
			'billing': billing,
			'shipping': shipping
		})
		if result.is_success or result.transaction:
			order.orderStatus = 'paid'
			order.save()
			return 'ok', 200
		else:
			raise InternalServerError

class BraintreeWebhookApi(Resource):
	def post(self):
		webhook_notification = braintreeGateway.webhook_notification.parse(str(request.form['bt_signature']), request.form['bt_payload'])

		# Example values for webhook notification properties
		print(webhook_notification.kind) # "subscription_went_past_due"
		print(webhook_notification.timestamp) # "Sun Jan 1 00:00:00 UTC 2012"

		return '', 200