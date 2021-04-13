import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductService } from './product.service';
import { HttpClientModule } from '@angular/common/http';
import { AllProductsComponent } from './all-products/all-products.component';


@NgModule({
	declarations: [
		AllProductsComponent
	],
	imports: [
		CommonModule,
		ProductRoutingModule,

		HttpClientModule
	],
	exports: [
		AllProductsComponent
	],
	providers: [
		ProductService
	]
})
export class ProductModule { }
