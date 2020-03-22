import {Component, HostListener} from '@angular/core';

import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';
import {P5ManagerService} from './services/p5-manager.service';
import {ViewportScroller} from '@angular/common';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass','./app-res.component.sass'],
	animations: [
		trigger('openClose', [
			// ...
			state('open', style({
				top : '1rem',
				opacity: 1,
			})),
			state('closed', style({
				top : '-20rem',
				left : '-10rem',
				opacity: 0,
			})),
			transition('open <=> closed', [
				animate('0.25s')
			])
		]),
		trigger('openCloseHeight', [
			// ...
			state('open', style({
				top : '1rem',
				opacity: 1,
			})),
			state('closed', style({
				top : '-10rem',
				left : '-5rem',
				opacity: 0,
				height: 0
			})),
			transition('open <=> closed', [
				animate('0.25s')
			])
		]),
	],
	providers : [P5ManagerService]
})

export class AppComponent {
	title = 'Alessia Sanna Landing Page';
	opens = [false , true];
	firstTime = true;

	constructor(private viewportScroller: ViewportScroller) {}

	ngOnInit() {

		window.addEventListener('scroll', this.scroll, true); //third parameter
	}

	ngOnDestroy() {
		window.removeEventListener('scroll', this.scroll, true);
	}

	scrollDown = false;
	lastScrollTop = 0;
	scroll = (event): void => {
		var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
		this.scrollDown = st > this.lastScrollTop;

		if(this.firstTime){
			this.opens[1] = false;
		}
		this.firstTime = false;


		this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
	};

	public scrollTo(elementId: string): void {
		this.viewportScroller.scrollToAnchor(elementId);
	}
}
