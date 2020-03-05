import {Component} from '@angular/core';
import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
	animations: [
		trigger('openClose', [
			// ...
			state('open', style({
				height: '200px',
				opacity: 1,
				backgroundColor: 'yellow'
			})),
			state('closed', style({
				height: '100px',
				opacity: 0.5,
				backgroundColor: 'green'
			})),
			transition('open => closed', [
				animate('1s')
			]),
			transition('closed => open', [
				animate('0.5s')
			]),
		]),
	]
})
export class AppComponent {
	title = 'Alessia Sanna Landing Page';
	opens = [];

	displayScs = (index) => this.opens[index] = this.opens[index] !== undefined ? !this.opens[index] : true;
}
