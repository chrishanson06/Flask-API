import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
	declarations: [DashboardComponent],
	imports: [
		CommonModule,
		VendorRoutingModule,
	],
})
export class VendorModule { }
