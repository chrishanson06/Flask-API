import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { CartService } from '../cart.service';

interface CartProduct {
	product: Product;
	qty: number;
}

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

	@Input() appearance: string;

	products: CartProduct[];
	cartSize: number;

	constructor(private cartService: CartService) {
		this.appearance = ''
		this.products = [];
		this.cartSize = 0;
	}

	ngOnInit(): void {
		this.cartService.cart$.subscribe(cart => {
			this.cartSize = 0;
			this.products = new Array(this.cartService.getLocalCart().length).fill({ product: '', qty: 0 });
			for (let i = 0; i < cart.length; i++) {
				this.cartSize += cart[i].qty;
				this.products[i].qty = cart[i].qty
			}
			this.cartService.getCart().then(products => {
				for (let i = 0; i < products.length; i++) {
					this.products[i].product = products[i];
				}
			})
		});
	}

	private idToProduct(item: CartItem) {
		return { id: item.id };
	}

	reduceProduct(product: Product): void {
		this.cartService.removeFromCart(product, 1);
	}

}
