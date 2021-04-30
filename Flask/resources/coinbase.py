from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from coinbase_commerce.error import WebhookInvalidPayload, SignatureVerificationError
from coinbase_commerce.webhook import Webhook

from database.models import Order

from resources.utils import calculate_order_amount

import json

from app import ccClient
from secret import coinbase_commerce_shared_secret

class CoinbaseChargeApi(Resource):
	@jwt_required(optional=True)
	def post(self):
		data = request.get_json()
		if not data:
			return ''
		order = Order.objects.get(id=data.get('order'))
		amount = calculate_order_amount(order.products)
		charge_info = {
			'name': 'Test Charge',
			'description': 'Test Description',
			'local_price': {
				'amount': amount,
				'currency': 'USD'
			},
			'pricing_type': 'fixed_price',
			'redirect_url': 'https://stel.software/checkout/placed?order=' + str(order.pk), # CHANGE THIS
			'metadata': {
				'user': get_jwt_identity(),
				'order': str(order.pk)
			}
		}
		charge = ccClient.charge.create(**charge_info)
		return jsonify(charge)

class CoinbaseWebhookApi(Resource):
	def post(self):
		payload = request.data.decode('utf-8')
		signature = request.headers.get('X-CC-Webhook-Signature')

		try:
			event = Webhook.construct_event(payload, signature, coinbase_commerce_shared_secret)
		except (WebhookInvalidPayload, SignatureVerificationError) as e:
			return str(e), 400
		
		print('Received event: id={id}, type={type}'.format(id=event.id, type=event.type))

		if event.type == 'charge:pending':
			order = Order(id=event.data.metadata.order)
			order.orderStatus = 'pending'
			order.save()
		elif event.type == 'charge:confirmed':
			order = Order(id=event.data.metadata.order)
			order.orderStatus = 'confirmed'
			order.save()
		elif event.type == 'charge:failed':
			order = Order(id=event.data.metadata.order)
			order.orderStatus = 'failed'
			order.save()

		return 'ok', 200