import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

	searchGroup: FormGroup;

	constructor() {
		this.searchGroup = new FormGroup({
			search: new FormControl('')
		});
	}

	ngOnInit(): void {
	}

	search(): void {
		const search = this.searchGroup.get('search')?.value;
		if (search) {
			console.log(search);
		}
	}

}
