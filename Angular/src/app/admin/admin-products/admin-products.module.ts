import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminProductsRoutingModule } from './admin-products-routing.module';
import { EditProductComponent } from './edit-product/edit-product.component';
import { NewProductComponent } from './new-product/new-product.component';
import { AllProductsComponent } from './all-products/all-products.component';


@NgModule({
  declarations: [
    EditProductComponent,
    NewProductComponent,
    AllProductsComponent
  ],
  imports: [
    CommonModule,
    AdminProductsRoutingModule
  ]
})
export class AdminProductsModule { }
