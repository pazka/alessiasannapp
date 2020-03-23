import {Component, HostListener, OnInit} from '@angular/core';

@Component({
			   selector   : 'app-home',
			   templateUrl: './home.component.html',
			   styleUrls  : ['./home.component.sass', './home-res.component.sass']
		   })
export class HomeComponent implements OnInit {

	constructor() {
	}


	ngOnInit(): void {
		$('video').each((i) => {
							console.log($('video')[i]);
							(<HTMLVideoElement> $('video')[i]).muted = true;
							(<HTMLVideoElement> $('video')[i]).play();
						}
		);
	}

}
