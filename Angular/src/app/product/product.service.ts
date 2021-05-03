import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

interface Id {
	id: string;
}

@Injectable({
	providedIn: 'root'
})
export class ProductService {

	private readonly productBase = environment.apiServer + 'product/';

	constructor(private http: HttpClient) { }

	public getAllProducts(search?: string): Observable<Product[]> {
		const accessToken = localStorage.getItem('accessToken');
		const params = new HttpParams().append('s', search ? search : '');
		if (accessToken) {
			const headers = new HttpHeaders().append('Authorization', 'Bearer ' + accessToken);
			return this.http.get<Product[]>(this.productBase + 'products', { headers, params });
		} else {
			return this.http.get<Product[]>(this.productBase + 'products', { params });
		}
	}

	public addProduct(product: Product): Observable<Id> {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			const headers = new HttpHeaders().append('Authorization', 'Bearer ' + accessToken);
			return this.http.post<Id>(this.productBase + 'products', product, { headers });
		} else {
			return new Observable<Id>();
		}
	}

}
