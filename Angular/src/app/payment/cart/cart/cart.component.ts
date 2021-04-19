import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { ProductCartItem } from 'src/app/models/product-cart-item';
import { environment } from 'src/environments/environment';
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

	products: ProductCartItem[];
	cartSize: number;

	private firstPass: boolean;

	constructor(private cartService: CartService, private http: HttpClient) {
		this.appearance = '';
		this.products = [];
		this.cartSize = 0;
		this.firstPass = true;
	}

	ngOnInit(): void {
		this.cartService.cart$.subscribe(async cart => {
			this.cartSize = 0;
			for (let i = 0; i < cart.length; i++) {
				this.cartSize += cart[i].qty;
			}
			if (this.firstPass) {
				this.firstPass = false;
				const builtLocalStorage: CartItem[] = [];
				this.cartService.getCart().then(products => {
					if (products) {
						this.products = new Array(products.length).fill({ product: '', qty: 0 });
						for (let i = 0; i < products.length; i++) {
							this.products[i].product = products[i].product;
							this.products[i].qty = products[i].qty;
							const id = this.products[i].product.id;
							if (id) {
								builtLocalStorage.push({ id, qty: this.products[i].qty });
							}
						}
						localStorage.setItem('cart', JSON.stringify(builtLocalStorage));
					}
				});
			} else {
				const cart = this.cartService.getLocalCart();
				this.products = new Array(cart.length).fill({ product: '', qty: 0 });
				for (let i = 0; i < cart.length; i++) {
					await this.http.get(environment.apiServer + 'product/product/' + cart[i].id).toPromise().then(product => {
						this.products[i].product = product;
						this.products[i].qty = cart[i].qty;
				});
			}
			}
		});
	}

	reduceProduct(product: Product, event: any): void {
		event.stopPropagation();
		this.cartService.removeFromCart(product, 1);
	}

}
