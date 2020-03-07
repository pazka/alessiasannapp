import {NgModule} from '@angular/core';
import {Routes, RouterModule, ExtraOptions, Router, Scroll} from '@angular/router';
import {ProjectsComponent} from './projects/projects.component';
import { HomeComponent } from './home/home.component';
import {ViewportScroller} from '@angular/common';
import {filter} from 'rxjs/operators';

const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'projects/:project', component: HomeComponent},
];
const routerOptions: ExtraOptions = {
	useHash: true,
	scrollPositionRestoration: 'enabled',
	anchorScrolling: 'enabled',
	scrollOffset: [0,-25]
};

@NgModule({
	imports: [RouterModule.forRoot(routes,routerOptions)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
