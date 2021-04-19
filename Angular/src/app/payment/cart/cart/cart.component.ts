import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { CartService } from '../cart.service';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

	@Input() appearance: string;

	products: Product[];
	cartSize: number;

	constructor(private cartService: CartService) {
		this.appearance = ''
		this.products = [];
		this.cartSize = 0;
	}

	ngOnInit(): void {
		this.cartService.cart$.subscribe(cart => {
			this.cartSize = cart.length;
		});
		this.cartService.getCart().then(products => {
			this.products = products;
			console.log(this.products);
		})
	}

	private idToProduct(item: CartItem) {
		return { id: item.id };
	}

}
