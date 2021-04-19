import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

interface Intent {
	clientSecret: string;
}

@Component({
	selector: 'app-checkout',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

	stripe: stripe.Stripe;
	products: any[]
	intent: Intent | null;

	constructor(private http: HttpClient) {
		// Change this on your end
		this.stripe = Stripe('pk_test_51IhjdIGRCaAvu4C0Vgoif76YwIwRb3ah3IQufMIgoYn5yXfzcfjR3Vek30TdGxjieJjp1InJ79QKnb3nl83f1YUo00vwi7ABJk');
		this.products = [{ 'sku': 'test', 'quantity': 1 }];
		this.intent = null;
	}

	ngOnInit(): void {
		const headers = new HttpHeaders().append('Content-Type', 'application/json');
		this.http.post<Intent>(environment.apiServer + 'payment/paymentIntent', JSON.stringify(this.products), { headers }).toPromise().then(intent => {
			this.intent = intent;
			const elements = this.stripe.elements();
			const style = {
				base: {
					color: "#32325d",
					fontFamily: 'Arial, sans-serif',
					fontSmoothing: "antialiased",
					fontSize: "16px",
					"::placeholder": {
						color: "#32325d"
					}
				},
				invalid: {
					fontFamily: 'Arial, sans-serif',
					color: "#fa755a",
					iconColor: "#fa755a"
				}
			};
			const card = elements.create('card', { style });
			card.mount('#card-element');

			card.on("change", function (event) {
				// Disable the Pay button if there are no card details in the Element
				const button = document.querySelector("button");
				const cardError = document.querySelector("#card-error");
				if (event && event.error && button && cardError) {
					button.disabled = event.empty;
					cardError.textContent = event.error ? event.error.message ? event.error.message : null : "";
				}
			});
			const self = this;
			const form = document.getElementById("payment-form");
			if (form) {
				form.addEventListener("submit", function (event) {
					event.preventDefault();
					// Complete payment when the submit button is clicked
					self.payWithCard(self.stripe, card, self.intent?.clientSecret);
				});
			}
		});
	}
	payWithCard(stripe: stripe.Stripe, card: stripe.elements.Element, clientSecret: string | undefined) {
		if (clientSecret) {
			// loading
			this.stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card
				}
			}).then(function (result) {
				if (result.error) {
					// Show error to your customer
					console.log('fail');
				} else {
					// The payment succeeded!
					console.log('success');
				}
			})
		}
	}

}
