'''
API Endpoints
'''

from .auth import SignupApi, LoginApi, ForgotPassword, ResetPassword, TokenRefresh, CheckPassword, UserApi
from .product import ProductsApi, ProductApi
from .file import UploaderApi, MediaApi, SingleMediaApi
from .cart import CartApi

from .stripe import PaymentIntentApi

from .admin import AdminApi, AdminUsersApi, AdminUserApi

def initialize_routes(api, base):
	api.add_resource(SignupApi, base + 'auth/signup')
	api.add_resource(LoginApi, base + 'auth/login')
	api.add_resource(ForgotPassword, base + 'auth/forgot')
	api.add_resource(ResetPassword, base + 'auth/reset')
	api.add_resource(TokenRefresh, base + 'auth/refresh')
	api.add_resource(CheckPassword, base + 'auth/checkPassword')
	api.add_resource(UserApi, base + 'auth/user')

	api.add_resource(ProductsApi, base + 'product/products')
	api.add_resource(ProductApi, base + 'product/product/<id>')

	api.add_resource(UploaderApi, base + 'file/uploader')
	api.add_resource(MediaApi, base + 'file/media')
	api.add_resource(SingleMediaApi, base + 'file/media/<filename>')

	api.add_resource(CartApi, base + 'cart/cart')

	api.add_resource(PaymentIntentApi, base + 'payment/paymentIntent')

	api.add_resource(AdminApi, base + 'admin/admin')
	api.add_resource(AdminUsersApi, base + 'admin/users')
	api.add_resource(AdminUserApi, base + 'admin/user/<id>')