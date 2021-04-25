import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

	user: User | null;
	becomingVendor: boolean;

	private subs: Subscription[];

	constructor(private auth: AuthService, private router: Router) {
		this.user = null;
		this.becomingVendor = false;
		this.subs = [];
	}

	ngOnInit(): void {
		this.auth.user$.subscribe(user => {
			this.user = user;
		});
	}

	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe());
	}

	becomeVendor(): void {
		this.becomingVendor = true;
		this.auth.updateUser({isVendor: true}).toPromise().then(res => {
			this.becomingVendor = false;
			// Refresh the user
			this.auth.getUser().toPromise().then(user => this.auth.setUser(user));
		});
	}

	deleteUser(): void {
		this.auth.deleteUser().toPromise().then(res => {
			localStorage.clear();
			this.auth.setUser(null);
			this.router.navigate(['/']);
		});
	}

}
