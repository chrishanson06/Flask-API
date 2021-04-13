import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from './admin.guard';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		canActivate: [AuthGuard, AdminGuard]
	},
	{
		path: 'users',
		component: UsersComponent,
		canActivate: [AuthGuard, AdminGuard]
	},
	{
		path: 'products',
		loadChildren: () => import('./admin-products/admin-products.module').then(m => m.AdminProductsModule),
		canActivate: [AuthGuard, AdminGuard]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
