'''
Stripe routes
'''

from flask import jsonify, request
from flask_restful_swagger_2 import Resource, swagger
from flask_jwt_extended import jwt_required, get_jwt_identity

from resources.errors import InternalServerError

from database.models import Order

from app import socketio
from resources.utils import calculate_order_amount

import json
import os

import stripe

class PaymentIntentApi(Resource):
	@swagger.doc({
		'tags': ['Payment', 'Stripe'],
		'description': 'Get a Stripe client secret',
		'parameters': [
			{
				'name': 'order',
				'description': 'The id of the order',
				'in': 'body',
				'type': 'string',
				'schema': {
					'type': 'string'
				},
				'required': True
			}			
		],
		'responses': {
			'200': {
				'description': 'the client secret',
				'examples': {
					'application/json': {
						'clientSecret': 'string'
					}
				}
			}
		}
	})
	@jwt_required(optional=True)
	def post(self):
		try:
			data = request.get_json()
			if not data:
				return ''
			order = Order.objects.get(id=data.get('order'))
			shipping = {
				'address': {
					'line1': order.addresses['shipping']['street1'],
					'line2': order.addresses['shipping']['street2'],
					'city': order.addresses['shipping']['city'],
					'state': order.addresses['shipping']['region'],
					'country': order.addresses['shipping']['country'],
					'postal_code': order.addresses['shipping']['zip']
				},
				'name': order.addresses['shipping']['name'],
				'phone': order.addresses['shipping']['phoneNumber']
			}
			amount = int(calculate_order_amount(order.products) * 100)
			intent = stripe.PaymentIntent.create(
				amount=amount,
				currency='usd',
				shipping=shipping,
				metadata={order: str(order.pk)}
			)
			return jsonify({
				'clientSecret': intent['client_secret']
			})
		except Exception:
			raise InternalServerError

class StripeApi(Resource):
	@swagger.doc({
		'tags': ['Stripe'],
		'description': 'Stripe webhook endpoint. Do not use.',
		'responses': {
			'200': {
				'description': 'always'
			}
		}
	})
	def post(self):
		payload = request.get_json()
		event = None

		try:
			event = stripe.Event.construct_from(
				payload, stripe.api_key
			)
		except ValueError:
			return '', 400

		if event.type == 'payment_intent.succeeded':
			payment_intent = event.data.object # contains a stripe.PaymentIntent
			order = Order(id=payment_intent['metadata']['Order object'])
			order.orderStatus = 'paid'
			order.save()
		elif event.type == 'payment_intent.failed':
			payment_intent = event.data.object # contains a stripe.PaymentIntent
			order = Order(id=payment_intent['metadata']['Order object'])
			order.orderStatus = 'failed'
			order.save()
		else:
			print('Unhandled event type {}'.format(event.type))
			return 'ok', 200

		socketio.emit('order ' + str(order.pk), order.orderStatus)

		return 'ok', 200