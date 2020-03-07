import {Injectable} from '@angular/core';
import * as P5 from 'p5';

@Injectable({
	providedIn: 'root'
})
export class P5ManagerService {
	public _canvas;

	constructor() {
	}

	reloadCanvas(idDom, sketch) {
		if (!sketch) {
			sketch = (s) => {

				s.preload = () => {
					// preload code
				};

				s.setup = () => {
					s.createCanvas(window.innerWidth, window.innerHeight);
				};

				s.draw = () => {
					s.background(0);
					s.fill(255);
					s.stroke(255,0,0);
					s.rect(0, 0, s.windowWidth, s.windowHeight);
					s.fill(255,0,0);
					s.text("P5_CANVAS",0,50);
					s.text("P5_CANVAS",s.windowWidth-50,s.windowHeight-50);
					s.text("P5_CANVAS",0,s.windowHeight-50);
					s.text("P5_CANVAS",s.windowWidth-50,0);
				};
			};
		}

		this._canvas = new P5(sketch, idDom);
		return this._canvas;
    }
}
