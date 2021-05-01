from database.models import Product

def calculate_order_amount(items):
	total = 0
	for item in items:
		total += float(item.product.price) * item.qty
	return total