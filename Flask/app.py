'''
Main Flask application
'''

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_mail import Mail
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_restful_swagger import swagger

from database.db import initialize_db
from resources.errors import errors

import stripe
from coinbase_commerce.client import Client
import braintree
from secret import stripe_sk, coinbase_commerce_api_key, braintree_merchant_id, braintree_public_key, braintree_private_key

import os

PRODUCTION = False

stripe.api_key = stripe_sk
ccClient = Client(api_key=coinbase_commerce_api_key)
braintreeGateway = braintree.BraintreeGateway(
	braintree.Configuration(
		braintree.Environment.Sandbox,
		merchant_id=braintree_merchant_id,
		public_key=braintree_public_key,
		private_key=braintree_private_key
	)
)

app = Flask(__name__)
if PRODUCTION:
	app.config['JWT_SECRET_KEY'] = 'even-more-secret' # CHANGE THIS
	app.config['MAIL_SERVER']: "localhost"
	app.config['MAIL_PORT'] = "1025"
	app.config['MAIL_USERNAME'] = "support@flaskapi.com"
	app.config['MAIL_PASSWORD'] = ""
	app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), '..', 'angular', 'assets', 'uploads')
	app.config['MONGODB_SETTINGS'] = {
		'host': 'mongodb://localhost/flask-api'
	}
	resources = {r"/*": {"origins": "https://api.website.com"}}
	socketResources = "api.website.com"
	base = '/'
else:
	app.config['JWT_SECRET_KEY'] = 'super-secret'
	app.config['MAIL_SERVER'] = "localhost"
	app.config['MAIL_PORT'] = "1025"
	app.config['MAIL_USERNAME'] = "support@flaskapi.com"
	app.config['MAIL_PASSWORD'] = ""
	app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), '..', 'Angular', 'src', 'assets', 'uploads')
	app.config['MONGODB_SETTINGS'] = {
		'host': 'mongodb://localhost/flask-api-test'
	}
	resources = {r"/*": {"origins": "http://localhost:4200"}}
	socketResources = "http://localhost:4200"
	base = '/api/'

mail = Mail(app)

cors = CORS(app, resources=resources)
api = swagger.docs(Api(app, errors=errors), apiVersion='1.0')
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins=socketResources)
limiter = Limiter(app, key_func=get_remote_address, default_limits=["2500 per day", "250 per hour"])

initialize_db(app)

from resources.routes import initialize_routes

initialize_routes(api, base)