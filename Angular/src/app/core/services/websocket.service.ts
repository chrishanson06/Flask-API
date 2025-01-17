import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {

	socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;

	constructor() {
		this.socket = null;
		const socket = io(environment.socketServer, {
			extraHeaders: {
				Authorization: 'Bearer ' + localStorage.getItem('accessToken')
			}
		});
		this.setSocket(socket);
	}

	setSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
		this.socket = socket;
	}

	killSocket() {
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
	}

	listen(eventName: string) {
		return new Observable(subscriber => {
			this.socket?.on(eventName, (data: any) => {
				subscriber.next(data);
			});
		});
	}

	emit(eventName: string, data: any): boolean {
		this.socket?.emit(eventName, data);
		return !!this.socket;
	}
}
