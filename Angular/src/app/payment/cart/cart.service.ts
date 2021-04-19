import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class CartService {

	public cart$: Observable<CartItem[]>;

	private cartSubject: BehaviorSubject<CartItem[]>;

	constructor(private http: HttpClient) {
		this.cartSubject = new BehaviorSubject<CartItem[]>(this.getLocalCart());
		this.cart$ = this.cartSubject.asObservable();
	}

	public async getCart(): Promise<Product[]> {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			const headers = new HttpHeaders().append('Authorization', 'Bearer ' + accessToken).append('Accept', 'application/json');
			return this.http.get<Product[]>(environment.apiServer + 'cart/cart', { headers }).toPromise();
		} else {
			const cart = this.getLocalCart();
			const mappedCart: Product[] = [];
			for (let i = 0; i < cart.length; i++) {
				await this.http.get(environment.apiServer + 'product/product/' + cart[i].id).toPromise().then(product => {
					mappedCart[i] = product;
				})
			}
			return mappedCart;
		}
	}

	public removeFromCart(product: Product, qty: number) {
		const cart = this.getLocalCart();
		if (product.id) {
			let flag = false;
			for (let i = 0; i < cart.length; i++) {
				if (cart[i].id === product.id) {
					flag = true;
					cart[i].qty -= qty;
				}
			}
			if (!flag) {
				return;
			}
			localStorage.setItem('cart', JSON.stringify(cart));
			
			this.cartSubject.next(cart);

			const accessToken = localStorage.getItem('accessToken');
			if (accessToken) {
				const headers = new HttpHeaders().append('Authorization', 'Bearer ' + accessToken);
				this.http.put<string>(environment.apiServer + 'cart/cart', cart, { headers });
			}
		}
	}

	public addToCart(product: Product): void {
		const cart = this.getLocalCart();
		if (product.id) {
			let flag = false;
			for (let i = 0; i < cart.length; i++) {
				if (cart[i].id === product.id) {
					flag = true;
					cart[i].qty++;
				}
			}
			if (!flag) {
				cart.push({id: product.id, qty: 1});
			}
			localStorage.setItem('cart', JSON.stringify(cart));
			
			this.cartSubject.next(cart);

			const accessToken = localStorage.getItem('accessToken');
			if (accessToken) {
				const headers = new HttpHeaders().append('Authorization', 'Bearer ' + accessToken);
				this.http.put<string>(environment.apiServer + 'cart/cart', cart, { headers });
			}
		}
	}

	public getLocalCart(): CartItem[] {
		const prevCart = localStorage.getItem('cart');
		let cart;
		if (prevCart) {
			cart = JSON.parse(prevCart);
		} else {
			cart = [];
		}
		return cart;
	}

}
