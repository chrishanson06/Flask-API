import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from './admin.guard';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'users',
		component: UsersComponent
	},
	{
		path: 'products',
		loadChildren: () => import('./admin-products/admin-products.module').then(m => m.AdminProductsModule),
	},
	{
		path: 'orders',
		loadChildren: () => import('./admin-orders/admin-orders.module').then(m => m.AdminOrdersModule),
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
