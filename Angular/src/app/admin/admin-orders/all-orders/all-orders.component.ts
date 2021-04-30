import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { AdminService } from '../../admin.service';

@Component({
	selector: 'app-all-orders',
	templateUrl: './all-orders.component.html',
	styleUrls: ['./all-orders.component.scss']
})
export class AllOrdersComponent implements OnInit {

	orders: Order[];

	constructor(private adminService: AdminService) {
		this.orders = [];
	}

	ngOnInit(): void {
		this.adminService.getAllOrders().toPromise().then(res => {
			this.orders = res;
			console.log(res);
		})
	}

}
