from database.models import Product

def calculate_order_amount(items):
	total = 0
	for item in items:
		try:
			total += float(item.product.price) * item.qty
		except Exception:
			# Product does not exist
			continue
	return total