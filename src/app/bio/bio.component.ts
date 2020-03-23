import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-bio',
	templateUrl: './bio.component.html',
	styleUrls: ['./bio.component.sass','./bio-res.component.sass']
})
export class BioComponent implements OnInit {

	constructor() {
	}

	@Output() playVideos: EventEmitter<any> = new EventEmitter();

	ngOnInit(): void {
	}

}
