import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {P5ManagerService}                         from '../services/p5-manager.service';
import {log}                                      from 'util';

@Component({
			   selector   : 'app-technical',
			   templateUrl: './technical.component.html',
			   styleUrls  : ['./technical.component.sass', './technical-res.component.sass']
		   })
export class TechnicalComponent implements OnInit {
	private p5;

	constructor(private _p5: P5ManagerService) {
		this.p5 = _p5;
	}

	@ViewChild('p5canvas') p5canvasElem: ElementRef;

	ngOnDestroy(): void{
		this.p5.reloadCanvas
	}

	//TODO : rewrtie position algorithm
	//TODO : resize mobile
	ngOnInit(): void {
		var _this = this;

		this.p5.reloadCanvas('p5canvas-technical', (p) => {
			var cnv,
				img_main_obj,
				img_sizeScale_obj,
				img_colorScale_obj,
				img_floor_obj,
				img_light_obj,
				img_sat_obj,
				vid_desc_obj,
				img_main,
				img_sizeSacle,
				img_colorScale,
				img_floor,
				img_light,
				img_sat,
				allImgObjs,
				allImgs;
			var descTitle;
			var shadeProj;

			var zoomCoef     = 1;
			var zoomStep     = 0.06;
			var dragOffset   = [0, 0];
			var _mousedClicked;
			var _sizeChanged = false;
			var tmpPos;
			var sway         = [0, 0];
			var spot         = [0.6, 0.1];

			function incrSway(i = 0) {
				sway[0] = p.sin(i + p.frameCount / 350);
				sway[1] = -p.abs((p.sin(i + p.frameCount / 350)));
			}

			function resetTmpIndicator() {
				_mousedClicked = false;
				_sizeChanged   = false;
			}

			function event_changeSize(event) {
				_sizeChanged = true;

				if (event.deltaY < 0) {
					zoomCoef += zoomStep;
				} else {
					zoomCoef -= zoomStep;
				}

				event.preventDefault();
			}

			function event_startDrag() {
				if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
					tmpPos = [p.mouseX, p.mouseY];
				}
			}

			function event_applyDrag(event) {
				if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
					dragOffset[0] += p.mouseX - tmpPos[0];
					dragOffset[1] += p.mouseY - tmpPos[1];
					tmpPos = [p.mouseX, p.mouseY];
					event.preventDefault();
				}
			}

			function event_mouseClicked() {
				_mousedClicked = true;
			}

			function _X(pos) {
				return pos * p.width * zoomCoef + dragOffset[0];
			}

			function _Y(pos) {
				return pos * p.height * zoomCoef + dragOffset[1];
			}

			function setGradient(x0, y0, x1, y1, x2, y2, x3, y3) {
				p.line(x0, y0, x3, y3);
				p.line(x1,y1,x2,y2);
				p.line(x0, y0, (x2+x3)/2, (y2+y3)/3);
			}

			function drawLines() {
				p.push();

				p.noFill();
				p.strokeWeight(1);


				var i = 0;
				allImgObjs.forEach((imgObj) => {
					if (!imgObj.circle)
						return;

					//draw circles
					p.blendMode(p.OVERLAY);
					p.stroke(255);
					p.drawingContext.setLineDash([]);
					p.ellipse(_X(img_main_obj.pos[0]) + img_main_obj.size[0] * imgObj.circle[0] * zoomCoef,
							  _Y(img_main_obj.pos[1]) + img_main_obj.size[1] * imgObj.circle[1] * zoomCoef,
							  30 * imgObj.circle[2] * sway[0],
							  15 * imgObj.circle[2] * sway[0]
					);
					incrSway(imgObj.circle[2] * 20);

					//draw projection
					p.push();
					p.fill('#0018f0');
					p.ellipse(_X(spot[0]), _Y(spot[1]), 30 * zoomCoef, 30 * zoomCoef);

					p.strokeWeight(1);
					p.stroke('#0018f0');
					var dots    = (new Array(10)).fill(5, 0, 10);
					var index   = 1 + ((((p.frameCount / 7) % (dots.length)) / 2) | 0) * 2;
					dots[index] = 20;
					p.drawingContext.setLineDash(dots);
					setGradient(_X(spot[0]), _Y(spot[1]),
								_X(spot[0]), _Y(spot[1]),
								_X(spot[0])+100, _Y(spot[1])+200,
								_X(spot[0])-200, _Y(spot[1])+150);
					p.pop();

					//draw lines
					p.push();
					p.blendMode(p.SCREEN);
					p.stroke(240);
					p.drawingContext.setLineDash([]);

					p.line(
						   _X(img_main_obj.pos[0]) + img_main_obj.size[0] * imgObj.circle[0] * zoomCoef,
						   _Y(img_main_obj.pos[1]) + img_main_obj.size[1] * imgObj.circle[1] * zoomCoef,
						   _X(imgObj.pos[0]) + imgObj.size[0] * zoomCoef / 2,
						   _Y(imgObj.pos[1]) + imgObj.size[1] * zoomCoef / 2
					);
					p.pop();

					i++;
				});
				p.pop();
			}

			p.preload = () => {
				img_main       = p.loadImage('../../assets/images/technical/main_ny.png');
				img_sizeSacle  = p.loadImage('../../assets/images/technical/size_scale.png');
				img_colorScale = p.loadImage('../../assets/images/technical/color_scale.jpg');
				img_floor      = p.loadImage('../../assets/images/technical/tapis.png');
				img_sat        = p.loadImage('../../assets/images/technical/sat.jpg');
				img_light      = p.loadImage('../../assets/images/technical/nycity.png');

				img_main_obj       = {pos: [0, 0], size: [0, 0], el: img_main, desc: p.select('#main').html()};
				img_sizeScale_obj  = {
					pos   : [0, 0],
					size  : [0, 0],
					el    : img_sizeSacle,
					desc  : p.select('#scale').html(),
					circle: [0.75, 0.40, 8]
				};
				img_colorScale_obj = {pos: [0, 0], size: [0, 0], el: img_colorScale};
				img_floor_obj      = {pos: [0, 0], size: [0, 0], el: img_floor, desc: p.select('#tapis').html(), circle: [0.65, 0.70, 6]};
				img_sat_obj        = {pos: [0, 0], size: [0, 0], el: img_sat, desc: p.select('#sat').html(), circle: [0.58, 0.10, 3]};
				img_light_obj      = {pos: [0, 0], size: [0, 0], el: img_light, desc: p.select('#light').html(), circle: [0.35, 0.30, 5]};

				allImgObjs = [
					img_sizeScale_obj,
					img_colorScale_obj,
					img_floor_obj,
					img_sat_obj,
					img_light_obj
				];

				allImgs = [
					img_sizeSacle,
					img_colorScale,
					img_floor,
					img_sat,
					img_light,
				];
			};

			p.setup = () => {
				if(_this.p5canvasElem.nativeElement && _this.p5canvasElem){
					cnv = p.createCanvas(_this.p5canvasElem.nativeElement.offsetWidth, _this.p5canvasElem.nativeElement.offsetHeight);
				}
				//cnv.mouseWheel(event_changeSize);
				//cnv.mouseClicked(event_mouseClicked);
				//cnv.touchStarted(event_startDrag);
				//cnv.touchEnded(event_startDrag);
				//p.mousePressed = event_startDrag;
				//p.mouseRelease = event_startDrag;
				//cnv.touchMoved(event_applyDrag);
				//p.mouseDragged = event_applyDrag;

				img_main_obj.size[0]       = 900 / 1920 * p.width;
				img_sizeScale_obj.size[0]  = 300 / 1920 * p.width;
				img_colorScale_obj.size[0] = 160 / 1920 * p.width;
				img_floor_obj.size[0]      = 300 / 1920 * p.width;
				img_sat_obj.size[0]        = 175 / 1920 * p.width;
				img_light_obj.size[0]      = 300 / 1920 * p.width;

				img_main_obj.pos = [0.25, 0.25];

				img_sizeScale_obj.pos  = [0.8, 0.1];
				img_colorScale_obj.pos = [0.835, 0.50];
				img_floor_obj.pos      = [0.80, 0.58];

				img_sat_obj.pos   = [0.05, 0.37];
				img_light_obj.pos = [0.05, 0.56];


				var i = 0;

				img_main_obj.size[1] = (img_main.height / img_main.width) * img_main_obj.size[0];
				allImgObjs.forEach((imgObj) => {
					imgObj.size[1] = (allImgs[i].height / allImgs[i].width) * imgObj.size[0];
					i++;
				});

				vid_desc_obj = {
					pos   : [0.05, 0.1],
					size  : [720 / 1920 * p.width / 2, 480 / 1080 * p.height / 2],
					el    : p.select('#vid_desc'),
					desc  : p.select('#vid').html(),
					circle: [0.18, 0.15, 2]
				};
				vid_desc_obj.el.loop();
				allImgObjs.push(vid_desc_obj);

				descTitle = p.select('#h1_desc').html();
			};

			p.draw = () => {
				p.clear();
				//Set sizes
				p.fill('#0018f0');

				//Draw Images
				p.image(img_main_obj.el,
						_X(img_main_obj.pos[0]),
						_Y(img_main_obj.pos[1]),
						img_main_obj.size[0] * zoomCoef,
						img_main_obj.size[1] * zoomCoef
				);

				drawLines();

				//draw txt
				p.textStyle(p.BOLD);
				p.textSize(18);
				p.text(img_main_obj.desc,
					   _X(img_main_obj.pos[0]) + 10,
					   _Y(img_main_obj.pos[1]) + img_main_obj.size[1] * zoomCoef - 20,
					   img_main_obj.size[0] * zoomCoef / 1.7
				);

				p.textStyle(p.NORMAL);
				p.textSize(12);
				p.textLeading(15);
				p.push();
				p.noStroke();
				p.fill(255);
				p.rect(_X(img_sizeScale_obj.pos[0]),_Y(img_sizeScale_obj.pos[1]),img_sizeScale_obj.size[0],img_sizeScale_obj.size[1]);
				p.pop();
				p.text(img_sizeScale_obj.desc,
					   _X(img_sizeScale_obj.pos[0]),
					   _Y(img_sizeScale_obj.pos[1]) + img_sizeScale_obj.size[1] * zoomCoef + 10,
					   img_sizeScale_obj.size[0] * zoomCoef
				);
				p.text(img_floor_obj.desc,
					   _X(img_floor_obj.pos[0]),
					   _Y(img_floor_obj.pos[1]) + img_floor_obj.size[1] * zoomCoef + 10,
					   img_floor_obj.size[0] * zoomCoef
				);

				p.textSize(12);
				p.text(vid_desc_obj.desc,
					   _X(vid_desc_obj.pos[0]) + vid_desc_obj.size[0] * zoomCoef + 10,
					   _Y(vid_desc_obj.pos[1]) + 10,
					   250 * zoomCoef
				);
				p.text(img_sat_obj.desc,
					   _X(img_sat_obj.pos[0]) + img_sat_obj.size[0] * zoomCoef + 10,
					   _Y(img_sat_obj.pos[1]) + 50,
					   250 * zoomCoef
				);
				p.text(img_light_obj.desc,
					   _X(img_light_obj.pos[0]) + img_light_obj.size[0] * zoomCoef + 10,
					   _Y(img_light_obj.pos[1]) + 50,
					   250 * zoomCoef
				);

				//draw images
				allImgObjs.forEach((img) => {
					p.image(img.el, _X(img.pos[0]), _Y(img.pos[1]), img.size[0] * zoomCoef, img.size[1] * zoomCoef);
				});

				//draw UI
				p.textStyle(p.BOLD);
				p.textSize(40);
				p.text(descTitle, _X(0.041), _Y(0.06));

				resetTmpIndicator();
			};
		});
	}
}
