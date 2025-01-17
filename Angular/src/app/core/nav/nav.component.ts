import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';

interface LinkPair {
	link: string;
	text: string;
}

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent {

	@ViewChild('drawer') public sidenav: MatSidenav | undefined;

	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	links: LinkPair[];

	user: User | null;

	private swipeCoord: number[];
	private swipeTime: number;

	constructor(private breakpointObserver: BreakpointObserver, private auth: AuthService, private router: Router, private ws: WebsocketService) {
		this.user = null;
		this.auth.user$.subscribe(user => {
			this.user = user;
		});
		this.links = [];
		this.swipeCoord = [0, 0];
		this.swipeTime = 0;
	}

	isSignedIn(): boolean {
		return !!localStorage.getItem('accessToken');
	}

	logout(): void {
		this.auth.setUser(null);
		localStorage.clear();
		this.ws.killSocket();
		const accessToken = localStorage.getItem('accessToken');
		let socket;
		if (accessToken) {
			socket = io(environment.socketServer, {
				extraHeaders: {
					Authorization: 'Bearer ' + accessToken
				}
			});
		} else {
			socket = io(environment.socketServer);
		}
		this.ws.setSocket(socket);
		this.router.navigate(['/']);
	}

	swipe(e: TouchEvent, when: string): void {
		const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
		const time = new Date().getTime();

		if (when === 'start') {
			this.swipeCoord = coord;
			this.swipeTime = time;
		} else if (when === 'end') {
			const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
			const duration = time - this.swipeTime;
			if (duration < 1000 //
				&& direction[0] > 30 // Long enough
				&& Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
				const swipe = direction[0] < 0 ? 'next' : 'previous';
				if (this.sidenav) {
					this.sidenav.open();
				}
			}
		}
	}

}
