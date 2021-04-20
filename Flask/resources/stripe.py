'''
Stripe routes
'''

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from resources.errors import InternalServerError

from database.models import Product

import json
import os

import stripe

def calculate_order_amount(items):
	total = 0
	for item in items:
		try:
			product = Product.objects.get(id=item['product']['id'])
			total += float(product.price) * item['qty']
		except Exception:
			# Product does not exist
			continue
	return int(total * 100)

class PaymentIntentApi(Resource):
	'''
	Create payment intent
	'''
	def post(self):
		try:
			data = json.loads(request.data)
			if not data:
				return ''
			intent = stripe.PaymentIntent.create(
				amount=calculate_order_amount(data),
				currency='usd'
				# TODO: description
			)
			return jsonify({
				'clientSecret': intent['client_secret']
			})
		except Exception:
			raise InternalServerError

class StripeApi(Resource):
	def post(self):
		payload = request.body
		event = None

		try:
			event = stripe.Event.construct_from(
				json.loads(payload), stripe.api_key
			)
		except ValueError:
			return '', 400

		if event.type == 'payment_intent.succeeded':
			payment_intent = event.data.object # contains a stripe.PaymentIntent
			# Then define and call a method to handle the successful payment intent.
			# handle_payment_intent_succeeded(payment_intent)
		elif event.type == 'payment_method.attached':
			payment_method = event.data.object # contains a stripe.PaymentMethod
			# Then define and call a method to handle the successful attachment of a PaymentMethod.
			# handle_payment_method_attached(payment_method)
			# ... handle other event types
		else:
			print('Unhandled event type {}'.format(event.type))

		return '', 200