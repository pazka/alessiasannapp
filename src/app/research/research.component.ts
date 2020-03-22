import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {P5ManagerService}                         from '../services/p5-manager.service';
import * as $                                     from 'jquery';

@Component({
			   selector   : 'app-research',
			   templateUrl: './research.component.html',
			   styleUrls  : ['./research.component.sass', './research-res.component.sass']
		   })

export class ResearchComponent implements OnInit {
	private p5;
	imgDatas =
		[
			{
				'imgId': '#img1',
				'pos'  : [0.1, 0.3],
				'link' : [
					{
						'imgId': '#img6',
						'pos'  : [0.20, 0.4],
					}, {
						'imgId': '#img2',
						'pos'  : [0.20, 0.2],
					},
					{
						'imgId': '#img3',
						'pos'  : [0.30, 0.3],
						'link' : [
							{
								'imgId': '#img4',
								'pos'  : [0.40, 0.47],
								'link' : [
									{
										'imgId': '#img9',
										'pos'  : [0.48, 0.60]
									},
									{
										'imgId': '#img11',
										'pos'  : [0.65, 0.60]
									},
									{
										'imgId': '#img10',
										'pos'  : [0.55, 0.45]
									}
								]
							},
							{
								'imgId': '#img5',
								'pos'  : [0.40, 0.22],
								'link' : [
									{
										'imgId': '#img7',
										'pos'  : [0.50, 0.30]
									},
									{
										'imgId': '#img8',
										'pos'  : [0.55, 0.18]
									},
								]
							},
						]
					}
				]
			}
		];

	selectedData               = null;
	clickedData                = null;
	selectedDataOnCanvasAnyway = false;
	allImgData                 = {
		array: [],
		ref  : {}
	};

	public lockData = (imgId) => {
		if (this.clickedData) //need for first time
		{
			$(this.clickedData.imgId).removeClass('locked');
		}

		$(imgId).addClass('locked');
		this.setDomFromData(imgId);
		this.clickedData = this.allImgData.ref[imgId];
	};

	selectData     = (imgId) => {
		if (this.selectedData) //need for first time
		{
			$(this.selectedData.imgId).removeClass('selected');
		}

		this.selectedData = this.allImgData.ref[imgId];
		this.setDomFromData(imgId);
		$(this.selectedData.imgId).addClass('selected');
	};
	setDomFromData = (imgId: string) => {
		$('#section-title').html(
			$(imgId + ' .img-name').html()
		);
		$('#section-description').html(
			$(imgId + ' .img-desc').html()
		);
	};


	constructor(private _p5: P5ManagerService) {
		this.p5 = _p5;
	}

	@ViewChild('p5canvas') p5canvasElem: ElementRef;

	ngOnInit(): void {
		var _this = this;

		this.p5.reloadCanvas('p5canvas-research', (p) => {
			var zoomCoef   = 1;
			var zoomStep   = 0.02;
			var dragOffset = [0, 0];
			var circleSize = 40;
			var cnv;
			var _mousedClicked;
			var tmpPos;
			var sway       = [0, 0];

			function incrSway(i = 0) {
				sway[0] = p.sin(i + p.frameCount / 60);
				sway[1] = -p.abs((p.sin(i + p.frameCount / 60)));
			}

			function event_mouseClicked() {
				_mousedClicked = true;
			}

			function event_changeSize(event) {
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

			function _X(pos) {
				return pos * p.width * zoomCoef + dragOffset[0] + sway[0] * zoomCoef;
			}

			function _Y(pos) {
				return pos * p.height * zoomCoef + dragOffset[1] + sway[1] * zoomCoef;
			}


			function processRecursiveData(_rawImgDatas, orig = false) {
				if (!origin) {
					_this.allImgData.array = [];
				}

				_rawImgDatas.forEach((imgData) => {
					// imgData.pos[0] = imgData.pos[0] ;
					// imgData.pos[1] = imgData.pos[1];

					if (imgData.link) {
						processRecursiveData(imgData.link, true);
					}

					_this.allImgData.array.push(imgData);
					_this.allImgData.ref[imgData.imgId] = imgData;
				});
			}

			function drawRecursiveData(_rawImgDatas, orig,isJustVertex) {
				p.fill(255, 255, 255, 255);
				p.stroke(0, 0, 255);
				p.strokeWeight(4);

				_rawImgDatas.forEach((imgData) => {
					incrSway(imgData.imgId.split('').map(c => c.charCodeAt(0)).reduce((a, c) => (a + c)));
					if (orig && !isJustVertex) {
						p.line(orig[0], orig[1], _X(imgData.pos[0]) + sway[0], _Y(imgData.pos[1]) + sway[1]);
					}
					if(isJustVertex){
						p.ellipse(_X(imgData.pos[0]) + sway[0], _Y(imgData.pos[1]) + sway[1], circleSize * zoomCoef, circleSize * zoomCoef);
					}

					if (imgData.link) {
						drawRecursiveData(imgData.link, [_X(imgData.pos[0]) + sway[0], _Y(imgData.pos[1]) + sway[1]],isJustVertex);
					}
				});
			}


			function drawDataImg(dataImg) {
				incrSway(dataImg.imgId.split('').map(c => c.charCodeAt(0)).reduce((a, c) => (a + c)));
				p.ellipse(_X(dataImg.pos[0]) + sway[0], _Y(dataImg.pos[1]) + sway[1], circleSize * zoomCoef, circleSize * zoomCoef);
			}


			p.setup = () => {
				if(_this.p5canvasElem.nativeElement && _this.p5canvasElem){
					cnv = p.createCanvas(_this.p5canvasElem.nativeElement.offsetWidth, _this.p5canvasElem.nativeElement.offsetHeight);
				}

				cnv.mouseWheel(event_changeSize);
				cnv.mouseClicked(event_mouseClicked);
				cnv.touchStarted(event_startDrag);
				cnv.touchEnded(event_startDrag);
				cnv.touchMoved(event_applyDrag);
				p.mousePressed = event_startDrag;
				p.mouseRelease = event_startDrag;
				p.mouseDragged = event_applyDrag;
				processRecursiveData(_this.imgDatas);
			};

			p.draw = () => {
				incrSway();
				p.strokeWeight(0);
				p.fill(255, 255, 255, 155);
				p.square(0, 0, p.width, p.height);
				p.cursor('auto');
				drawRecursiveData(_this.imgDatas, null,false);
				drawRecursiveData(_this.imgDatas, null,true);

				if (_this.selectedData) {
					if ((p.mouseX > _X(_this.selectedData.pos[0]) - (circleSize * zoomCoef) / 2 &&
						p.mouseX < _X(_this.selectedData.pos[0]) + (circleSize * zoomCoef) / 2 &&
						p.mouseY > _Y(_this.selectedData.pos[1]) - (circleSize * zoomCoef) / 2 &&
						p.mouseY < _Y(_this.selectedData.pos[1]) + (circleSize * zoomCoef) / 2) ||
						p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
						// 1- if selectedData exist check if we are on it to display it
						p.stroke(200, 200, 255, 155);
						p.fill(240, 240, 255, 155);
						drawDataImg(_this.selectedData);
						if (_mousedClicked) {
							this.lockData(_this.selectedData.imgId);
						}
						p.cursor('pointer');
					} else {
						// 1- otherwise delete the reference
						p.select(_this.selectedData.imgId).removeClass('selected');
						_this.selectedData = null;
					}
				} else {
					// 2 - If no selected Data search for a new one
					_this.allImgData.array.forEach((d) => {
						if (p.mouseX > _X(d.pos[0]) - (circleSize * zoomCoef) / 2 &&
							p.mouseX < _X(d.pos[0]) + (circleSize * zoomCoef) / 2 &&
							p.mouseY > _Y(d.pos[1]) - (circleSize * zoomCoef) / 2 &&
							p.mouseY < _Y(d.pos[1]) + (circleSize * zoomCoef) / 2) {
							_this.selectData(d.imgId);
						}
					});
				}

				if (_this.clickedData) {
					p.stroke(0, 0, 255, 155);
					p.fill(0, 0, 255, 255);
					drawDataImg(_this.clickedData);
				}


				_mousedClicked = false;
			};
		});
	}
}
