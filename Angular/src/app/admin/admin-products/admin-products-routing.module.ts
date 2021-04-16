import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductsComponent } from './all-products/all-products.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { NewProductComponent } from './new-product/new-product.component';

const routes: Routes = [
	{
		path: 'all-products',
		component: AllProductsComponent
	},
	{
		path: 'new-product',
		component: NewProductComponent
	},
	{
		path: 'product/:id/edit',
		component: EditProductComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminProductsRoutingModule { }
