import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

	isHandset: boolean;
	gettingCards: boolean;
	selectingMedia: boolean;
	
	isVendor: boolean;

	private subs: Subscription[];

	constructor(private breakpointObserver: BreakpointObserver, private auth: AuthService) {
		this.isHandset = false;
		this.gettingCards = true;
		this.selectingMedia = false;
		this.breakpointObserver.observe(Breakpoints.Handset).pipe(
			map(({ matches }) => {
				this.isHandset = matches;
			})
		);
		this.subs = [];
		this.isVendor = false;
		this.subs.push(this.auth.user$.subscribe(user => {
			if (user?.isVendor) {
				this.isVendor = user.isVendor;
			}
		}));
	}

	ngOnInit(): void {
		
	}

	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe());
	}

	onSelectedImage(url: string) {
		console.log(url);
	}

}
