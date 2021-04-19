'''
Stripe routes
'''

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from resources.errors import InternalServerError

import json
import os

import stripe

def calculate_order_amount(items):
	# Replace this constant with a calculation of the order's amount
    # Calculate the order total on the server to prevent
    # people from directly manipulating the amount on the client
    return 1400

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

