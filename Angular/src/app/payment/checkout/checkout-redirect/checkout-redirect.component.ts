import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-checkout-redirect',
	templateUrl: './checkout-redirect.component.html',
	styleUrls: ['./checkout-redirect.component.scss']
})
export class CheckoutRedirectComponent implements OnInit, OnDestroy {

	order: Order | null;

	private orderID: string | null;
	private refreshInterval: any;

	constructor(private route: ActivatedRoute, private http: HttpClient) {
		this.orderID = null;
		this.order = null;
		this.refreshInterval = null;
	}

	ngOnInit(): void {
		this.orderID = this.route.snapshot.queryParamMap.get('id');
		this.getData();
		this.refreshInterval = setInterval(() => {
			this.getData()
		}, 1000 * 60);
	}

	ngOnDestroy(): void {
		if (this.refreshInterval) {
			window.clearInterval(this.refreshInterval);
		}
	}

	getData(): void {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			const headers = new HttpHeaders().append('Authorization', 'Bearer ' + accessToken).append('Accept', 'application/json');
			this.http.get<Order>(environment.apiServer + 'order/order/' + this.orderID, { headers }).toPromise().then(res => {
				this.order = res;
				console.log(res);
			});
		} else {
			this.http.get<Order>(environment.apiServer + 'order/order/' + this.orderID).toPromise().then(res => {
				this.order = res;
				console.log(res);
			});
		}
	}

}
