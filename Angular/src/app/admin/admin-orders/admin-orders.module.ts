import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminOrdersRoutingModule } from './admin-orders-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AllOrdersComponent
  ],
  imports: [
    CommonModule,
    AdminOrdersRoutingModule,

	ReactiveFormsModule,

	MatFormFieldModule,
	MatInputModule,
	MatButtonModule,
	MatExpansionModule
  ]
})
export class AdminOrdersModule { }
