/*
 * @Author: fanzhang
 * @Date:   2016-08-15 19:09:31
 * @Last Modified by:   fanzhang
 * @Last Modified time: 2016-08-15 21:16:10
 */

'use strict';
window.Dashboard = (function() {

	var DPR = 3;

	var MIN_ANGLE = -Math.PI-Math.PI/18;

	var MAX_ANGLE = Math.PI/18;

	var CONTAINER_ID = "dash_container";

	var BACKGROUND = "#4285f4";

	var PADDING_SIDE =35;//默认是70的宽度

	var FOREIGN_LINE_WIDTH = 2;//最外边的指示线的宽度

	var MAIN_LINE_WIDTH = 8;//最外边的指示线的宽度

	function Dashboard(config) {

		this.init();
	}

	Dashboard.prototype = {
		init: function() {

			this.canvas = document.getElementById(CONTAINER_ID);
			var width = document.body.clientWidth ;
			var radius = width/2  - PADDING_SIDE;
			var height = radius * 1.3;
			this.radius = radius;
			this.radiusX = width  * DPR / 2;//坐标X的中心以绘图区域的中心
			this.radiusY = radius* DPR;//坐标y是绘图半径往下刚好
			this.canvas.setAttribute('width', width * DPR);
			this.canvas.setAttribute('height', height * DPR);
			$(this.canvas).css({
				width: width,
				height: height,
				display: "block"
			});
			this.drawCanvas();

		},
		drawCanvas: function() {
			var ctx = this.canvas.getContext("2d");
			
			ctx.translate(this.radiusX, this.radiusY);

			ctx.beginPath();
			//最外侧的边缘
			ctx.arc(0, 0, this.radius*DPR, MIN_ANGLE,MAX_ANGLE);
			ctx.lineWidth = FOREIGN_LINE_WIDTH*DPR;
			ctx.strokeStyle = "#82b2ff";
			ctx.stroke();


			ctx.beginPath();
			//主要的边缘
			ctx.arc(0, 0, (this.radius-5-MAIN_LINE_WIDTH/2)*DPR, MIN_ANGLE,MAX_ANGLE);
			ctx.lineWidth = MAIN_LINE_WIDTH*DPR;
			ctx.strokeStyle = "#5495fd";
			ctx.stroke();



		}
	};
	return Dashboard;
})();