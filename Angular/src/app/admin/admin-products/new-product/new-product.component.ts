import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/product/product.service';

@Component({
	selector: 'admin-new-product',
	templateUrl: './new-product.component.html',
	styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

	productGroup: FormGroup;

	constructor(private productService: ProductService, private router: Router) {
		this.productGroup = new FormGroup({
			name: new FormControl('', [Validators.required]),
			slug: new FormControl('', [Validators.required]),
			featured: new FormControl(''),
			price: new FormControl('0.00', [Validators.required])
		})
	}

	ngOnInit(): void {
	}

	calcSlug(): void {

	}

	submit(): void {
		if (this.productGroup.valid) {
			const product: Product = {
				name: this.productGroup.get('name')?.value,
				slug: this.productGroup.get('slug')?.value,
				featured: this.productGroup.get('featured')?.value,
				price: this.productGroup.get('price')?.value,
			}
			this.productService.addProduct(product).toPromise().then(res => {
				this.router.navigate(['/admin'])
			});
		}
	}

}
