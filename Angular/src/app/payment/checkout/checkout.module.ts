import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { HttpClientModule } from '@angular/common/http';

import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
	declarations: [
		CheckoutComponent
	],
	imports: [
		CommonModule,
		CheckoutRoutingModule,

		HttpClientModule,

		MatStepperModule
	]
})
export class CheckoutModule { }
