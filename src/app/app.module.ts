import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatVideoModule } from 'mat-video';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ResearchComponent} from './research/research.component';
import {BioComponent} from './bio/bio.component';
import {WhatIsComponent} from './what-is/what-is.component';
import {ProjectsComponent} from './projects/projects.component';
import { TechnicalComponent } from './technical/technical.component';
import { HomeComponent } from './home/home.component';


@NgModule({
	declarations: [
		AppComponent,
		ResearchComponent,
		BioComponent,
		WhatIsComponent,
		ProjectsComponent,
		TechnicalComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatVideoModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
