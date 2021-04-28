import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartService } from '../../cart/cart.service';
import * as braintree from 'braintree-web';
import { CartItem } from 'src/app/models/cart-item';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface Intent {
	clientSecret?: string;
	hosted_url?: string;
	clientToken?: string
}

@Component({
	selector: 'app-checkout',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

	stripe: stripe.Stripe;
	products: CartItem[]
	stripeIntent: Intent | null;
	coinbaseIntent: Intent | null;

	hostedFieldsInstance: braintree.HostedFields | null;
	cardholdersName: string;
	deviceData:  string;

	addressForm: FormGroup;

	constructor(private http: HttpClient, private cartService: CartService) {
		this.stripe = Stripe(environment.stripeKey);
		this.products = [];
		this.stripeIntent = null;
		this.coinbaseIntent = null;

		this.hostedFieldsInstance = null;
		this.cardholdersName = '';
		this.deviceData = '';

		this.addressForm = new FormGroup({
			country: new FormControl('', [Validators.required])
		});
	}

	ngOnInit(): void {
		const headers = new HttpHeaders().append('Content-Type', 'application/json');

		/*this.cartService.getCart().toPromise().then(cart => {
			this.products = cart;
			this.http.post<Intent>(environment.apiServer + 'payment/stripePaymentIntent', JSON.stringify(cart), { headers })
				.toPromise().then(intent => {
					this.stripeIntent = intent;
					const elements = this.stripe.elements();
					const style = {
						base: {
							color: '#32325d',
							fontFamily: 'Arial, sans-serif',
							fontSmoothing: 'antialiased',
							fontSize: '16px',
							'::placeholder': {
								color: '#32325d'
							}
						},
						invalid: {
							fontFamily: 'Arial, sans-serif',
							color: '#fa755a',
							iconColor: '#fa755a'
						}
					};
					const card = elements.create('card', { style });
					card.mount('#card-element');

					card.on('change', function (event) {
						// Disable the Pay button if there are no card details in the Element
						const button = document.querySelector('button');
						const cardError = document.querySelector('#card-error');
						if (event && event.error && button && cardError) {
							button.disabled = event.empty;
							cardError.textContent = event.error ? event.error.message ? event.error.message : null : '';
						}
					});
					const form = document.getElementById('stripe-payment-form');
					if (form) {
						form.addEventListener('submit', event => {
							event.preventDefault();
							// Complete payment when the submit button is clicked
							this.payWithCard(this.stripe, card, this.stripeIntent?.clientSecret);
						});
					}
				});

			this.http.get<Intent>(environment.apiServer + 'payment/braintreeClientToken', { headers })
				.toPromise().then(intent => {
					if (intent.clientToken) {
						braintree.client.create({
							authorization: intent.clientToken
						}).then((clientInstance: any) => {
							braintree.dataCollector.create({
								client: clientInstance
							}).then((dataCollectorInstance: braintree.DataCollector) => {
								this.deviceData = dataCollectorInstance.deviceData;
							});
							braintree.hostedFields.create({
								client: clientInstance,
								styles: {

								},
								fields: {
									number: {
										selector: '#card-number',
										placeholder: '1111 1111 1111 1111'
									},
									cvv: {
										selector: '#cvv',
										placeholder: '111'
									},
									expirationDate: {
										selector: '#expiration-date',
										placeholder: 'MM/YY'
									}
								}
							}).then((hostedFieldsInstance) => {

								this.hostedFieldsInstance = hostedFieldsInstance;

								hostedFieldsInstance.on('focus', (event) => {
									const field = event.fields[event.emittedBy];
									const label = this.findLabel(field);
									label?.classList.remove('filled'); // added and removed css classes
									// can add custom code for custom validations here
								});

								hostedFieldsInstance.on('blur', (event) => {
									const field = event.fields[event.emittedBy];
									const label = this.findLabel(field); // fetched label to apply custom validations
									// can add custom code for custom validations here
								});

								hostedFieldsInstance.on('empty', (event) => {
									const field = event.fields[event.emittedBy];
									// can add custom code for custom validations here
								});

								hostedFieldsInstance.on('validityChange', (event) => {
									const field = event.fields[event.emittedBy];
									const label = this.findLabel(field);
									if (field.isPotentiallyValid) { // applying custom css and validations
										label?.classList.remove('invalid');
									} else {
										label?.classList.add('invalid');
									}
									// can add custom code for custom validations here
								});
							});
						});
					}
				});

			this.http.post<Intent>(environment.apiServer + 'payment/coinbasePaymentIntent', JSON.stringify(cart), { headers })
				.toPromise().then(intent => {
					this.coinbaseIntent = intent;
				});
		});
		*/
	}

	payWithCard(stripe: stripe.Stripe, card: stripe.elements.Element, clientSecret: string | undefined) {
		if (clientSecret) {
			// loading
			this.stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card
				}
			}).then(function (result: any) {
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

	tokenizeUserDetails() {
		this.hostedFieldsInstance?.tokenize({ cardholderName: this.cardholdersName }).then((payload) => {
			console.log(payload);
			// Example payload return on succesful tokenization

			/* {nonce: "tokencc_bh_hq4n85_gxcw4v_dpnw4z_dcphp8_db4", details: {…},
			description: "ending in 11", type: "CreditCard", binData: {…}}
			binData: {prepaid: "Unknown", healthcare: "Unknown", debit: "Unknown", durbinRegulated: "Unknown", commercial: "Unknown", …}
			description: "ending in 11"
			details: {bin: "411111", cardType: "Visa", lastFour: "1111", lastTwo: "11"}
			nonce: "tokencc_bh_hq4n85_gxcw4v_dpnw4z_dcphp8_db4"
			type: "CreditCard"
			__proto__: Object
			*/

			const pack = { payment_method_nonce: payload.nonce, items: this.products, deviceData: this.deviceData };
			this.http.post<any>(environment.apiServer + 'payment/braintreeClientToken', pack).toPromise().then(res => {
				console.log(res);
			});
		}).catch((error) => {
			console.log(error);
			// perform custom validation here or log errors
		});
	}

	findLabel(field: any) {
		return document.querySelector('.hosted-field--label[for="' + field.container.id + '"]');
	}

	setCardholderName(event: any) {
		this.cardholdersName = event.target.value;
	}

}
