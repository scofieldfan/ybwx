/*
 * @Author: fanzhang
 * @Date:   2016-08-15 19:09:31
 * @Last Modified by:   fanzhang
 * @Last Modified time: 2016-08-19 20:08:56
 */

'use strict';
window.Dashboard = (function() {

	var DPR = 3;

	var MIN_ANGLE = -Math.PI - Math.PI / 9;

	var MAX_ANGLE = Math.PI / 9;

	var CONTAINER_ID = "dash_container";

	var BG_CONTAINER_ID = "dash_bg_container";

	var BACKGROUND = "#4285f4";

	var PADDING_SIDE = 48.5; //默认是70的宽度

	var FOREIGN_LINE_WIDTH = 1; //最外边的指示线的宽度

	var MAIN_LINE_WIDTH = 10; //最外边的指示线的宽度

	function Dashboard(config) {

		var config = config || {};
		this.maxScore = parseFloat(config.score) || 0;
		console.log("maxScore:" + this.maxScore);
		this.maxAngle = (MAX_ANGLE - MIN_ANGLE) * this.maxScore / 10 + MIN_ANGLE;
		this.init();

	}

	function preLoadImg(url, callback) {
		var img = new Image(); //创建一个Image对象，实现图片的预下载  
		img.src = url;

		if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
			callback.call(img);
			return; // 直接返回，不用再处理onload事件  
		}

		img.onload = function() { //图片下载完毕时异步调用callback函数。  
			callback.call(img); //将回调函数的this替换为Image对象  
		};
	}

	function clearCircle(context, x, y, radius) {
		context.save();
		context.globalCompositeOperation = 'destination-out';
		context.beginPath();
		context.arc(x, y, radius, 0, 2 * Math.PI, false);
		context.fill();
		context.restore();
	};

	function drawZhiZhen(ctx, angle, width, startR, endR, color) {
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.moveTo(startR * Math.cos(angle), startR * Math.sin(angle));
		ctx.lineTo(endR * Math.cos(angle), endR * Math.sin(angle));
		ctx.stroke();
	}

	function drawWord(ctx, angle, font, color, radius, word, rotate) {
		ctx.textAlign = "center";
		// ctx.font = "normal 39px Arial,Microsoft YaHei";
		ctx.font = font;
		//ctx.font = "normal 39px Arial,Microsoft YaHei";
		ctx.fillStyle = color;
		var textX = (radius) * Math.cos(angle);
		var textY = (radius) * Math.sin(angle);
		ctx.beginPath();
		ctx.save();
		ctx.translate(textX, textY);
		ctx.rotate(rotate);
		ctx.fillText(word, 0, 0);
		ctx.restore();
	}

	function setWidthHeight(canvas, width, height) {
		canvas.setAttribute('width', width * DPR);
		canvas.setAttribute('height', height * DPR);
		$(canvas).css({
			width: width,
			height: height,
			display: "block"
		});


	}

	function clearCircle(context, x, y, radius) {
		context.save();
		context.globalCompositeOperation = 'destination-out';
		context.beginPath();
		context.arc(x, y, radius, 0, 2 * Math.PI, false);
		context.fill();
		context.restore();
	};

	Dashboard.prototype = {



		init: function() {

			var width = document.body.clientWidth;
			var sum_width = $(document).width() > 640 ? 640 : $(document).width();
			this.radio = sum_width / 414;
			var radius = width / 2 - PADDING_SIDE * this.radio;
			var height = radius * 1.5;

			this.radius = radius;
			this.score = 0;
			this.easing = 0.05;
			this.bgCanvas = document.getElementById(BG_CONTAINER_ID);
			this.canvas = document.getElementById(CONTAINER_ID);

			this.radiusX = width * DPR / 2; //坐标X的中心以绘图区域的中心
			this.radiusY = radius * DPR; //坐标y是绘图半径往下刚好


			setWidthHeight(this.bgCanvas, width, height);
			setWidthHeight(this.canvas, width, height);

			var bgCtx = this.bgCanvas.getContext("2d");
			bgCtx.translate(this.radiusX, this.radiusY);

			var ctx = this.canvas.getContext("2d");
			ctx.translate(this.radiusX, this.radiusY);

			this.drawbgCanvas();
			this._angle = MIN_ANGLE;
			var _this = this;
			setTimeout(function() {
				_this.draw();
				_this.scoreAnimation();
			}, 200)
			// var backgroundImg = new Image();
			// backgroundImg.src = '/img/index/bgc.png';
			// ctx.translate(this.radiusX, this.radiusY);
			// ctx.beginPath();
			// var bgcWidth = 952 * this.radio;
			// var bgcHeight = 643 * this.radio;
			// preLoadImg('/img/index/bgc.png', function() {
			// 	ctx.globalCompositeOperation = "destination-over";
			// 	ctx.drawImage(this, -bgcWidth / 2, -bgcHeight / 2, bgcWidth, bgcHeight);
			// });
			// this.drawCanvas(-Math.PI);

		},
		scoreAnimation: function() {
			var score = this.score;
			var ctx = this.bgCanvas.getContext("2d");
			var scoreRadius = (this.mainArcRaidus - this.radio * 150) * DPR;
			ctx.fillStyle = "#4285f4"; //白色为例子；
			ctx.fillRect(-140 * this.radio, -scoreRadius - 180 * this.radio, 370 * this.radio, 200 * this.radio);

			//drawWord(ctx, -Math.PI / 2, "normal " + 135 * this.radio + "px Arial,Microsoft YaHei", "#fff", scoreRadius, score, 0);
			drawWord(ctx, -Math.PI / 2, "normal 204px Arial,Microsoft YaHei", "#fff", scoreRadius, score, 0);
			score = (parseFloat(score) + 0.1).toFixed(1);
			this.score = score;

			console.log(score);
			if (score > this.maxScore) {
				return;
			}
			window.requestAnimationFrame(this.scoreAnimation.bind(this));
		},
		draw: function() {

			var angle = this._angle;
			var ctx = this.canvas.getContext("2d");

			var keduX = (this.radius - 5) * DPR * Math.cos(angle);
			var keduY = (this.radius - 5) * DPR * Math.sin(angle);
			// ctx.beginPath();
			// ctx.save();
			// ctx.globalCompositeOperation = 'destination-out';
			// ctx.fillStyle="#4285f4";//白色为例子；
			// ctx.fillRect(keduX-100, keduY-100,300,300);
			// ctx.restore();
			clearCircle(ctx, keduX, keduY, 300);
			preLoadImg('/img/index/fire.png', function() {
				ctx.beginPath();
				ctx.save();
				// console.log("keduX:"+keduX);
				// console.log("keduY:"+keduY);
				ctx.translate(keduX, keduY);
				// var ang = (angle - MIN_ANGLE) * 180 / Math.PI;
				// ctx.rotate(Math.PI * (215 + ang) / 180);

				var ang = (angle - MIN_ANGLE);
				ctx.rotate(3.7524578 + ang);

				ctx.drawImage(this, -26, -33, 52, 66);
				ctx.restore();
			})
			var vx = (this.maxAngle - this._angle) * this.easing;

			 //this._angle += vx;
			 this._angle += 0.01;
			 console.log("drawing....");
			if (this._angle >= this.maxAngle || vx<0.0001) {
				clearCircle(ctx, keduX, keduY, 300);
				preLoadImg('/img/index/fixFire.png', function() {
					ctx.beginPath();
					ctx.save();
					ctx.translate(keduX, keduY);
					var ang = (angle - MIN_ANGLE);
					ctx.rotate(3.7524578 + ang);
					ctx.drawImage(this, -26, -33, 52, 66);
					ctx.restore();
				})
				return;
			}
			window.requestAnimationFrame(this.draw.bind(this));
			//window.requestAnimationFrame(this.draw,this.canvas);
		},
		drawbgCanvas: function() {



			var _this = this;

			var ctx = this.bgCanvas.getContext("2d");

			// console.log("radiusX:" + this.radiusX);
			// console.log("radiusY:" + this.radiusY);

			// var bgcWidth = 952 * this.radio;
			// var bgcHeight = 643 * this.radio;

			// var cosX = Math.cos(angle);
			// var sinX = Math.sin(angle);
			// var keduX = bgcHeight * cosX / 2;
			// var keduY = bgcHeight * sinX / 2;

			// preLoadImg('/img/index/fire.png', function() {
			// 	ctx.beginPath();
			// 	ctx.save();
			// 	console.log("keduX:"+keduX);
			// 	console.log("keduY:"+keduY);
			// 	ctx.translate(keduX, keduY);
			// 	ctx.rotate(Math.PI * 215/ 180 + angle);
			// 	ctx.drawImage(this, -26, -33, 52, 66);
			// 	ctx.restore();
			// })


			ctx.beginPath();
			//最外侧的边缘
			var foreignRadius = this.radius - 5;
			ctx.arc(0, 0, foreignRadius * DPR, MIN_ANGLE, MAX_ANGLE);
			ctx.lineWidth = FOREIGN_LINE_WIDTH * DPR;
			ctx.strokeStyle = "#82b2ff";
			ctx.stroke();

			ctx.beginPath();
			//主要的边缘
			var mainArcRaidus = foreignRadius - 5 - MAIN_LINE_WIDTH / 2;
			this.mainArcRaidus = mainArcRaidus;
			ctx.arc(0, 0, mainArcRaidus * DPR, MIN_ANGLE, MAX_ANGLE);
			ctx.lineWidth = MAIN_LINE_WIDTH * DPR;
			ctx.strokeStyle = "#5495fd";
			ctx.stroke();

			var littleRadius = (mainArcRaidus - 12) * DPR;

			var littleDur = (MAX_ANGLE - MIN_ANGLE) / 25;


			var smallZhizhenWidth = 2;
			for (var i = 0; i < 25; i++) {

				drawZhiZhen(ctx, MIN_ANGLE + i * littleDur, smallZhizhenWidth, (mainArcRaidus - MAIN_LINE_WIDTH / 2) * DPR, (mainArcRaidus + MAIN_LINE_WIDTH / 2) * DPR, "#639efd");
			}


			var dur = (MAX_ANGLE - MIN_ANGLE) / 10;


			//绘画圆圈
			for (var i = 0; i < 11; i++) {

				if (i !== 6 && i !== 8 && i != 10) {

					var angle = MIN_ANGLE + i * dur;
					var keduX = littleRadius * Math.cos(angle);
					var keduY = littleRadius * Math.sin(angle);
					ctx.beginPath();


					ctx.arc(keduX, keduY, 6, 0, 2 * Math.PI);
					ctx.lineWidth = FOREIGN_LINE_WIDTH * DPR;
					ctx.fillStyle = "#5495fd";

					ctx.fill();
				}
			}

			var zhizhenWidth = 3;
			for (var i = 0; i < 11; i += 2) {

				var angle = MIN_ANGLE + i * dur;
				drawZhiZhen(ctx, angle, zhizhenWidth, (mainArcRaidus - MAIN_LINE_WIDTH / 2) * DPR, (mainArcRaidus + MAIN_LINE_WIDTH / 2) * DPR, "#72a7fd");
			}

			drawWord(ctx, MIN_ANGLE + 6 * dur, "normal 33px Arial,Microsoft YaHei", "#bdd6ff", (mainArcRaidus - 22) * DPR, "基础", 25 * Math.PI / 180);
			drawWord(ctx, MIN_ANGLE + 8 * dur, "normal 33px Arial,Microsoft YaHei", "#bdd6ff", (mainArcRaidus - 22) * DPR, "推荐", 60 * Math.PI / 180);
			drawWord(ctx, MIN_ANGLE + 10 * dur, "normal 33px Arial,Microsoft YaHei", "#bdd6ff", (mainArcRaidus - 22) * DPR, "无忧", 100 * Math.PI / 180);

			var baozhangRadius = (mainArcRaidus - this.radio * 70) * DPR;

			var scoreRadius = (mainArcRaidus - this.radio * 160) * DPR;

			var textRadius = (mainArcRaidus - this.radio * 190) * DPR;
			drawWord(ctx, -Math.PI / 2, "normal " + this.radio * 45 + "px Arial,Microsoft YaHei", "#90baff", baozhangRadius, "您的保障评分", 0);
			//drawWord(ctx, -Math.PI/2,"normal 135px Arial,Microsoft YaHei", "#fff", scoreRadius, "7.5", 0);
			var word = "";
			if (this.maxScore >= 0 && this.maxScore < 6) {
				word = "保障偏低";
			} else if (this.maxScore >= 6 && this.maxScore < 8) {
				word = "保障较好";
			} else if (this.maxScore >= 8) {
				word = "保障全面";
			}
//			drawWord(ctx, -Math.PI / 2, "normal " + this.radio * 52 + "px Arial,Microsoft YaHei", "#fff", textRadius, word, 0);
			drawWord(ctx, -Math.PI / 2, "normal 66px Arial,Microsoft YaHei", "#fff", textRadius, word, 0);
		}
	};
	return Dashboard;
})();