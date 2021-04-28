import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface CountryPair {
	name: string;
	code: string;
}

@Component({
	selector: 'app-country-select',
	templateUrl: './country-select.component.html',
	styleUrls: ['./country-select.component.scss']
})
export class CountrySelectComponent implements OnInit {

	@Input() countryControl: FormControl;

	countries: CountryPair[];
	filteredCountries: Observable<CountryPair[]>;

	constructor(private http: HttpClient) {
		this.countryControl = new FormControl('');
		this.countries = [];
		this.filteredCountries = this.countryControl.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value))
		);
	}

	ngOnInit(): void {
		this.http.get<CountryPair[]>(window.location.origin + '/assets/country/countries.json').toPromise().then(res => {
			this.countries = res;
		})
	}

	private _filter(value: string): CountryPair[] {
		const filterValue = value.toLowerCase();
		console.log(filterValue);
		return this.countries.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
	}

}
