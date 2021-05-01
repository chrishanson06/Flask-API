import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

	searchGroup: FormGroup;

	constructor(private router: Router) {
		this.searchGroup = new FormGroup({
			search: new FormControl('')
		});
	}

	ngOnInit(): void {
	}

	search(): void {
		const search = this.searchGroup.get('search')?.value;
		this.router.navigate(['/'], { queryParams: { s: search } })
	}

}
