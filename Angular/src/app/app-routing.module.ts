import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './admin/admin.guard';
import { AuthGuard } from './auth/auth.guard';
import { LandingComponent } from './core/landing/landing.component';
import { SwaggerComponent } from './core/swagger/swagger.component';
import { VendorGuard } from './vendor/vendor.guard';

const routes: Routes = [
	{
		path: '',
		component: LandingComponent
	},
	{
		path: 'swagger',
		component: SwaggerComponent
	},
	{
		path: 'settings',
		loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'vendor',
		loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule),
		canActivate: [AuthGuard, VendorGuard]
	},
	{
		path: 'cart',
		loadChildren: () => import('./payment/cart/cart.module').then(m => m.CartModule)
	},
	{
		path: 'checkout',
		loadChildren: () => import('./payment/checkout/checkout.module').then(m => m.CheckoutModule)
	},
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
		canActivate: [AuthGuard, AdminGuard]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
