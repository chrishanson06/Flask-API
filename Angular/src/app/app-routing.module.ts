import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './admin/admin.guard';
import { AuthGuard } from './auth/auth.guard';
import { LandingComponent } from './core/landing/landing.component';
import { LoaderComponent } from './core/loader/loader.component';
import { SwaggerComponent } from './core/swagger/swagger.component';

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
		path:"loader", 
		component: LoaderComponent
	},
	{
		path: 'settings',
		loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
		canActivate: [AuthGuard]
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
