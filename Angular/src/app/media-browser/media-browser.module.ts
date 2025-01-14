import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaBrowserComponent } from './media-browser/media-browser.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	declarations: [MediaBrowserComponent],
	imports: [
		CommonModule,

		MatProgressSpinnerModule,
		MatButtonModule,
		MatIconModule
	],
	exports: [MediaBrowserComponent]
})
export class MediaBrowserModule { }
