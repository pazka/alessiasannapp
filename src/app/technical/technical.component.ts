import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {P5ManagerService}                         from '../services/p5-manager.service';

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
	}

	ngOnInit(): void {
		var _this = this;

		var sketch_desktop = (p) => {
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
			var spot         = [0, 0];
			var spot_title;

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
					p.ellipse((img_main_obj.pos[0]) + img_main_obj.size[0] * imgObj.circle[0] * zoomCoef,
							  (img_main_obj.pos[1]) + img_main_obj.size[1] * imgObj.circle[1] * zoomCoef,
							  30 * imgObj.circle[2] * sway[0],
							  15 * imgObj.circle[2] * sway[0]
					);
					incrSway(imgObj.circle[2] * 20);

					//draw projection
					p.push();
					p.fill('#0018f0');
					p.ellipse((spot[0]), (spot[1]), 30 * zoomCoef, 30 * zoomCoef);

					p.strokeWeight(1);
					p.stroke('#0018f0');
					var dots    = (new Array(10)).fill(5, 0, 10);
					var index   = 1 + ((((p.frameCount / 7) % (dots.length)) / 2) | 0) * 2;
					dots[index] = 20;
					p.drawingContext.setLineDash(dots);
					setGradient((spot[0]), (spot[1]),
								(spot[0]), (spot[1]),
								(spot[0])+100, (spot[1])+200,
								(spot[0])-200, (spot[1])+150);
					p.pop();

					//draw lines
					p.push();
					p.blendMode(p.SCREEN);
					p.stroke(240);
					p.drawingContext.setLineDash([]);

					p.line(
						   (img_main_obj.pos[0]) + img_main_obj.size[0] * imgObj.circle[0] * zoomCoef,
						   (img_main_obj.pos[1]) + img_main_obj.size[1] * imgObj.circle[1] * zoomCoef,
						   (imgObj.pos[0]) + imgObj.size[0] * zoomCoef / 2,
						   (imgObj.pos[1]) + imgObj.size[1] * zoomCoef / 2
					);
					p.pop();

					i++;
				});
				p.pop();
			}

			p.preload = () => {
				img_main       = p.loadImage('assets/images/technical/main_ny.png');
				img_sizeSacle  = p.loadImage('assets/images/technical/size_scale.png');
				img_colorScale = p.loadImage('assets/images/technical/color_scale.jpg');
				img_floor      = p.loadImage('assets/images/technical/tapis.png');
				img_sat        = p.loadImage('assets/images/technical/sat.jpg');
				img_light      = p.loadImage('assets/images/technical/nycity.png');

				img_main_obj       = {pos: [0, 0], size: [0, 0], el: img_main, desc: p.select('#main').html()};
				img_sizeScale_obj  = {
					pos   : [0, 0],
					size  : [0, 0],
					el    : img_sizeSacle,
					desc  : p.select('#scale').html(),
					title  : p.select('#scale_title').html(),
					circle: [0.75, 0.40, 8]
				};
				img_colorScale_obj = {pos: [0, 0], size: [0, 0], el: img_colorScale, title: p.select('#colorScale_title').html()};
				img_floor_obj      = {pos: [0, 0], size: [0, 0], el: img_floor, desc: p.select('#tapis').html(), title: p.select('#tapis_title').html(), circle: [0.65, 0.70, 6]};
				img_sat_obj        = {pos: [0, 0], size: [0, 0], el: img_sat, desc: p.select('#sat').html(), title: p.select('#sat_title').html(), circle: [0.58, 0.10, 3]};
				img_light_obj      = {pos: [0, 0], size: [0, 0], el: img_light, desc: p.select('#light').html(), title: p.select('#light_title').html(), circle: [0.35, 0.30, 5]};
				spot_title = p.select("#spot_title").html();

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

				img_main_obj.pos = [0.25 * p.width, 0.25 * p.height];

				img_sizeScale_obj.pos  = [0.8 * p.width, 0.1 * p.height];
				img_colorScale_obj.pos = [0.835 * p.width, 0.50 * p.height];
				img_floor_obj.pos      = [0.80 * p.width, 0.58 * p.height];

				img_sat_obj.pos   = [0.05 * p.width, 0.37 * p.height];
				img_light_obj.pos = [0.05 * p.width, 0.56 * p.height];

				spot         = [0.6 * p.width, 0.1 * p.height];

				var i = 0;

				img_main_obj.size[1] = (img_main.height / img_main.width) * img_main_obj.size[0];
				allImgObjs.forEach((imgObj) => {
					imgObj.size[1] = (allImgs[i].height / allImgs[i].width) * imgObj.size[0];
					i++;
				});

				vid_desc_obj = {
					pos   : [0.05 * p.width, 0.1 * p.height],
					size  : [720 / 1920 * p.width / 2, 480 / 1080 * p.height / 2],
					el    : p.select('#vid_desc'),
					desc  : p.select('#vid').html(),
					title  : p.select('#vid_title').html(),
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
						img_main_obj.pos[0],
						img_main_obj.pos[1],
						img_main_obj.size[0] * zoomCoef,
						img_main_obj.size[1] * zoomCoef
				);

				drawLines();

				//draw txt
				p.textStyle(p.BOLD);
				p.textSize(18);
				p.text(img_main_obj.desc,
					   img_main_obj.pos[0] + 10,
					   img_main_obj.pos[1] + img_main_obj.size[1] * zoomCoef - 20,
					   img_main_obj.size[0] * zoomCoef / 1.7
				);

				p.textStyle(p.NORMAL);
				p.textSize(12);
				p.textLeading(15);
				p.push();
				p.noStroke();
				p.fill(255);
				p.rect((img_sizeScale_obj.pos[0]),(img_sizeScale_obj.pos[1]),img_sizeScale_obj.size[0],img_sizeScale_obj.size[1]);
				p.pop();
				p.text(img_sizeScale_obj.desc,
					   (img_sizeScale_obj.pos[0]),
					   (img_sizeScale_obj.pos[1]) + img_sizeScale_obj.size[1] * zoomCoef + 10,
					   img_sizeScale_obj.size[0] * zoomCoef
				);
				p.text(img_floor_obj.desc,
					   (img_floor_obj.pos[0]),
					   (img_floor_obj.pos[1]) + img_floor_obj.size[1] * zoomCoef + 10,
					   img_floor_obj.size[0] * zoomCoef
				);

				p.textSize(12);

				p.text(vid_desc_obj.desc,
					   (vid_desc_obj.pos[0]) + vid_desc_obj.size[0] * zoomCoef + 10,
					   (vid_desc_obj.pos[1]) + 10,
					   250 * zoomCoef
				);
				p.text(img_sat_obj.desc,
					   (img_sat_obj.pos[0]) + img_sat_obj.size[0] * zoomCoef + 10,
					   (img_sat_obj.pos[1]) + 50,
					   250 * zoomCoef
				);
				p.text(img_light_obj.desc,
					   (img_light_obj.pos[0]) + img_light_obj.size[0] * zoomCoef + 10,
					   (img_light_obj.pos[1]) + 50,
					   250 * zoomCoef
				);
				p.textSize(14);
				p.textStyle(p.BOLD);
				p.text(img_floor_obj.title,
					   (img_floor_obj.pos[0] - 20),
					   (img_floor_obj.pos[1] - 18),
					   img_floor_obj.size[0]
				);
				p.text(img_colorScale_obj.title,
					   (img_colorScale_obj.pos[0] - 85),
					   (img_colorScale_obj.pos[1] - 16),
					   img_colorScale_obj.size[0]
				);
				p.text(vid_desc_obj.title,
					   (vid_desc_obj.pos[0]) ,
					   (vid_desc_obj.pos[1]) - 20,
					   250 * zoomCoef
				);
				p.text(img_sat_obj.title,
					   (img_sat_obj.pos[0]) ,
					   (img_sat_obj.pos[1]) - 20,
					   250 * zoomCoef
				);

				//draw images
				allImgObjs.forEach((img) => {
					p.image(img.el, (img.pos[0]), (img.pos[1]), img.size[0] , img.size[1] );
				});

				p.text(img_light_obj.title,
					   (img_light_obj.pos[0]),
					   (img_light_obj.pos[1]) +30 ,
					   250 * zoomCoef
				);
				p.text(img_sizeScale_obj.title,
					   (img_sizeScale_obj.pos[0]),
					   (img_sizeScale_obj.pos[1] + 20) ,
					   img_sizeScale_obj.size[0]
				);
				p.text(spot_title,
					   (spot[0] - 40),
					   (spot[1] - 30)
				);

				//draw UI
				p.textStyle(p.BOLD);
				p.textSize(40);
				p.text(descTitle, 0.041 * p.width, 0.06 * p.height);

				resetTmpIndicator();
			};
		};

		var sketch_mobile = (p) => {
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
			var spot         = [0, 0];
			var spot_title;

			function incrSway(i = 0) {
				sway[0] = p.sin(i + p.frameCount*5 / 350);
				sway[1] = -p.abs((p.sin(i + p.frameCount*5 / 350)));
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
				p.line(x0, y0, x3 + (x0-x3)/2 , y0+(y2-y0)/2);
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
					p.ellipse((img_main_obj.pos[0]) + img_main_obj.size[0] * imgObj.circle[0] * zoomCoef,
							  (img_main_obj.pos[1]) + img_main_obj.size[1] * imgObj.circle[1] * zoomCoef,
							  30 * imgObj.circle[2] * sway[0],
							  15 * imgObj.circle[2] * sway[0]
					);
					incrSway(imgObj.circle[2] * 20);

					//draw projection
					p.push();
					p.fill('#0018f0');
					p.ellipse((spot[0]), (spot[1]), 30 * zoomCoef, 30 * zoomCoef);

					p.strokeWeight(1);
					p.stroke('#0018f0');
					var dots    = (new Array(10)).fill(5, 0, 10);
					var index   = 1 + ((((p.frameCount * 5 / 7) % (dots.length)) / 2) | 0) * 2;
					dots[index] = 20;
					p.drawingContext.setLineDash(dots);
					setGradient((spot[0]), (spot[1]),
								(spot[0]), (spot[1]),
								(spot[0])-60, (spot[1])+80,
								(spot[0])-200, (spot[1])+50);
					p.pop();

					//draw lines
					p.push();
					p.blendMode(p.SCREEN);
					p.stroke(240);
					p.drawingContext.setLineDash([]);

					p.line(
						(img_main_obj.pos[0]) + img_main_obj.size[0] * imgObj.circle[0] * zoomCoef,
						(img_main_obj.pos[1]) + img_main_obj.size[1] * imgObj.circle[1] * zoomCoef,
						(imgObj.pos[0]) + imgObj.size[0] * zoomCoef / 2,
						(imgObj.pos[1]) + imgObj.size[1] * zoomCoef / 2
					);
					p.pop();

					i++;
				});
				p.pop();
			}

			p.preload = () => {
				img_main       = p.loadImage('assets/images/technical/main_ny.png');
				img_sizeSacle  = p.loadImage('assets/images/technical/size_scale.png');
				img_colorScale = p.loadImage('assets/images/technical/color_scale.jpg');
				img_floor      = p.loadImage('assets/images/technical/tapis.png');
				img_sat        = p.loadImage('assets/images/technical/sat.jpg');
				img_light      = p.loadImage('assets/images/technical/nycity.png');

				img_main_obj       = {pos: [0, 0], size: [0, 0], el: img_main, desc: p.select('#main').html()};
				img_sizeScale_obj  = {
					pos   : [0, 0],
					size  : [0, 0],
					el    : img_sizeSacle,
					desc  : p.select('#scale').html(),
					title  : p.select('#scale_title').html(),
					circle: [0.75, 0.40, 8]
				};
				img_colorScale_obj = {pos: [0, 0], size: [0, 0], el: img_colorScale,title : p.select('#colorScale_title').html() };
				img_floor_obj      = {pos: [0, 0], size: [0, 0], el: img_floor, desc: p.select('#tapis').html(),title : p.select('#tapis_title').html() , circle: [0.65, 0.70, 4]};
				img_sat_obj        = {pos: [0, 0], size: [0, 0], el: img_sat, desc: p.select('#sat').html(),title : p.select('#sat_title').html() , circle: [0.35, 0.30, 3]};
				img_light_obj      = {pos: [0, 0], size: [0, 0], el: img_light, desc: p.select('#light').html(),title : p.select('#light_title').html() , circle: [0.58, 0.10, 2]};

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
				p.frameRate(5);
				if(_this.p5canvasElem.nativeElement && _this.p5canvasElem){
					cnv = p.createCanvas(_this.p5canvasElem.nativeElement.offsetWidth, _this.p5canvasElem.nativeElement.offsetHeight);
				}

				img_main_obj.size[0]       = 1400 / 1920 * p.width;
				img_sizeScale_obj.size[0]  = 500 / 1920 * p.width;
				img_colorScale_obj.size[0] = 420 / 1920 * p.width;
				img_floor_obj.size[0]      = 600 / 1920 * p.width;
				img_sat_obj.size[0]        = 400 / 1920 * p.width;
				img_light_obj.size[0]      = 800 / 1920 * p.width;

				img_main_obj.pos = [0.10 * p.width, 0.18 * p.height];

				img_sizeScale_obj.pos  = [0.70 * p.width, 0.3 * p.height];
				img_colorScale_obj.pos = [0.535 * p.width, 0.45 * p.height];
				img_floor_obj.pos      = [0.50 * p.width, 0.48 * p.height];

				img_sat_obj.pos   = [0.1 * p.width, 0.80 * p.height];
				img_light_obj.pos = [0.12 * p.width, 0.90 * p.height];

				spot         = [0.9 * p.width, 0.14 * p.height];
				spot_title   = p.select('#spot_title').html();

				var i = 0;

				img_main_obj.size[1] = (img_main.height / img_main.width) * img_main_obj.size[0];
				allImgObjs.forEach((imgObj) => {
					imgObj.size[1] = (allImgs[i].height / allImgs[i].width) * imgObj.size[0];
					i++;
				});

				vid_desc_obj = {
					pos   : [0.05 * p.width, 0.7 * p.height],
					size  : [100  , 66 ],
					el    : p.select('#vid_desc'),
					desc  : p.select('#vid').html(),
					title  : p.select('#vid_title').html(),
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
						img_main_obj.pos[0],
						img_main_obj.pos[1],
						img_main_obj.size[0] * zoomCoef,
						img_main_obj.size[1] * zoomCoef
				);

				drawLines();

				//draw txt
				p.textStyle(p.BOLD);
				p.textSize(12);
				p.text(img_main_obj.desc,
					   img_main_obj.pos[0] - 15,
					   img_main_obj.pos[1] - img_main_obj.size[1] / 2 - 40 ,
					   img_main_obj.size[0]+15
				);

				p.textStyle(p.NORMAL);
				p.textSize(11);
				p.textLeading(15);
				p.push();
				p.noStroke();
				p.fill(255);
				p.rect((img_sizeScale_obj.pos[0]),(img_sizeScale_obj.pos[1]),img_sizeScale_obj.size[0],img_sizeScale_obj.size[1]);
				p.pop();
				p.text(img_sizeScale_obj.desc,
					   (img_sizeScale_obj.pos[0] - img_sizeScale_obj.size[0]*2),
					   (img_sizeScale_obj.pos[1]) + img_sizeScale_obj.size[1] + 10,
					   img_sizeScale_obj.size[0] * 3
				);
				p.text(img_floor_obj.desc,
					   (img_floor_obj.pos[0] - img_floor_obj.size[0]*1.3),
					   (img_floor_obj.pos[1]) + img_floor_obj.size[1] + 10,
					   img_floor_obj.size[0] * 3
				);

				p.textSize(12);
				p.text(vid_desc_obj.desc,
					   (vid_desc_obj.pos[0]) + vid_desc_obj.size[0] * zoomCoef + 10,
					   (vid_desc_obj.pos[1]) ,
					   200
				);
				p.text(img_sat_obj.desc,
					   (img_sat_obj.pos[0]) + img_sat_obj.size[0] * zoomCoef + 10,
					   (img_sat_obj.pos[1]) ,
					   180
				);
				p.text(img_light_obj.desc,
					   (img_light_obj.pos[0]) + img_light_obj.size[0] * zoomCoef + 10,
					   (img_light_obj.pos[1]) ,
					   160
				);

				p.textStyle(p.BOLD);
				p.textSize(14);
				p.text(img_floor_obj.title,
					   (img_floor_obj.pos[0] - 70),
					   (img_floor_obj.pos[1] + 10),
					   img_floor_obj.size[0]
				);
				p.text(img_colorScale_obj.title,
					   (img_colorScale_obj.pos[0] - 85),
					   (img_colorScale_obj.pos[1] - 16),
					   img_colorScale_obj.size[0]
				);
				p.text(vid_desc_obj.title,
					   (vid_desc_obj.pos[0]) ,
					   (vid_desc_obj.pos[1]) - 20,
					   250 * zoomCoef
				);
				p.text(img_sat_obj.title,
					   (img_sat_obj.pos[0]) ,
					   (img_sat_obj.pos[1]) - 20,
					   250 * zoomCoef
				);

				//draw images
				allImgObjs.forEach((img) => {
					p.image(img.el, (img.pos[0]), (img.pos[1]), img.size[0] , img.size[1] );
				});

				p.text(img_light_obj.title,
					   (img_light_obj.pos[0] - 10),
					   (img_light_obj.pos[1])  ,
					   250 * zoomCoef
				);
				p.text(img_sizeScale_obj.title,
					   (img_sizeScale_obj.pos[0] + 10),
					   (img_sizeScale_obj.pos[1] ) ,
					   img_sizeScale_obj.size[0]
				);
				p.push();
				p.textSize(13);
				p.textAlign(p.RIGHT);
				p.text(spot_title,
					   (spot[0] -5),
					   (spot[1] - 50),
					   40
				);
				p.pop();
				//draw UI
				p.textStyle(p.BOLD);
				p.textSize(40);
				p.text(descTitle, 0.041 * p.width, 0.06 * p.height);

				resetTmpIndicator();
			};
		};

		if($(window).width() >= $(window).height()){
			this.p5.reloadCanvas('p5canvas-technical',sketch_desktop);
		}
		else{
			this.p5.reloadCanvas('p5canvas-technical',sketch_mobile);
		}
	}
}
