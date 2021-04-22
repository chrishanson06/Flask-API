import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminProductsRoutingModule } from './admin-products-routing.module';
import { EditProductComponent } from './edit-product/edit-product.component';
import { NewProductComponent } from './new-product/new-product.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EditProductComponent,
    NewProductComponent,
    AllProductsComponent
  ],
  imports: [
    CommonModule,
    AdminProductsRoutingModule,

	ReactiveFormsModule,

	MatFormFieldModule,
	MatInputModule,
	MatCheckboxModule,
	MatButtonModule
  ]
})
export class AdminProductsModule { }
