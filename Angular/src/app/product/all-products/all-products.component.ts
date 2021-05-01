import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from '../product.service';

@Component({
	selector: 'app-all-products',
	templateUrl: './all-products.component.html',
	styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit, OnDestroy {

	products: Product[];
	loading: boolean;

	private subs: Subscription[];

	constructor(private productService: ProductService, private route: ActivatedRoute) {
		this.products = [];
		this.loading = true;
		this.subs = [];
	}

	ngOnInit(): void {
		this.subs.push(this.route.queryParams.subscribe(res => {
			this.loading = true;
			this.products = [];
			this.productService.getAllProducts(res.s).toPromise().then(products => {
				this.products = products;
				this.loading = false;
			});
		}));
	}

	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe);
	}



}
