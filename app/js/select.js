//$(function() {
var CIRCLE = (function() {

	var config = {
		marginTop: 20,
		padding: 34,
		lineWidth: 57,
		closePadding: 40,
		dpr: 3
	};
	var baozhang_tiaojian = {
		//0:["顺时针滑动提升分数"]

	};
	var baozhang_score = {};
	var baozhang_money = {
		0: ['20', '40', '60', '80', '100']
	};
	//var default_tiaojian = "顺时针滑动提升分数";
	//var default_money = ['20','40','60','80','100'];

	/*
	var baozhang_tiaojian = {
		0:["滑动显示"],
		1:["自驾车意外"],
		2:["自驾车意外","航空意外"],
		3:["自驾车意外","航空意外","火车意外"],
		4:["自驾车意外","航空意外","火车意外","客运汽车意外"],
		5:["交通意外"],
		6:["交通综合意外","境内旅游意外"],
		7:["交通综合意外","境内旅游意外","港澳台旅游意外","境外台旅游意外"],
		8:["综合意外"],
		9:["综合意外","骑行意外"],
		10:["综合意外","运动意外"]
	}

	*/
	function updateMoney(score) {
		if (baozhang_money && baozhang_money[score] && baozhang_money[score] != "") {
			console.log("update...");
			console.log(baozhang_money[score]);
			var kedus = $("#customerSlider").find(".kedu").find("p");
			for (var i = 1; i < kedus.length; i++) {
				$(kedus[i]).html(baozhang_money[score][i - 1] + "万");
			}
		}
	}

	function init(coverageScores, tiaojian, money) {
		baozhang_score = coverageScores;
		baozhang_tiaojian = tiaojian;
		baozhang_money = money;
		//$scope = scope;
		changeText(0);

	}

	var MIN_ANGLE = -Math.PI * 4 / 3;
	var MAX_ANGLE = Math.PI / 3;
	var TWO_PI = 2 * Math.PI;
	var PI2 = Math.PI / 180;
	var MIN_ANGLE_DEGREE = 210; //12点钟为0度为开始计算
	var MAX_ANGLE_DEGREE = 150;
	var bgCanvas = document.getElementById("bgchartContainer");
	var canvas = document.getElementById("chartContainer");
	var width = $(document).width() - config.padding;
	//console.log("document width:" + $(document).width());
	//if (width > 500) {
	//	width = 500;
	//}
	var height = parseInt(width);
	console.log(width);
	console.log(height);
	var radius = width; //一共可绘图的半径
	bgCanvas.setAttribute('width', width * config.dpr);
	bgCanvas.setAttribute('height', height * config.dpr);
	$(bgCanvas).css({
		width: width,
		height: height,
		display: "block"
	})

	canvas.setAttribute('width', width * config.dpr);
	canvas.setAttribute('height', height * config.dpr);
	$(canvas).css({
		width: width,
		height: height,
		display: "block"
	})

	var ctx = canvas.getContext("2d");
	var ctxBg = bgCanvas.getContext("2d");
	var radius = canvas.width / 2;
	var radiusX = radius;
	var radiusY = radius;
	var mHold = 0;
	ctx.translate(radiusX, radiusY);
	ctxBg.translate(radiusX, radiusY);
	radius = radius * 0.75;
	var smallRadius = radius;
	var bigRadius = radius + config.lineWidth / 2;
	var angle = MIN_ANGLE_DEGREE;
	drawFace(ctx, radius, angle);
	load(); //初始化
	drawBg(ctxBg); //绘制背景

	var text_width = canvas.width * 0.5;
	$("#chartTextContainer").css({
		'left': (radiusX) / config.dpr,
		'top': (radiusY - radius * 2 / 3) / config.dpr,
		'width': text_width / config.dpr,
		"margin-left": -text_width / (2 * config.dpr)
	})

	function log(ary) {
		$("#log").html(ary.join("<br/>"));
	}

	function load() {
		document.getElementById("clockContainer").addEventListener('touchstart', touch, false);
		document.getElementById("clockContainer").addEventListener('touchmove', touch, false);
		document.getElementById("clockContainer").addEventListener('touchend', touch, false);

		//var startX;
		//var startY;


		var lastX = -radiusX / config.dpr;
		var lastY = radiusY / config.dpr;

		function touch(event) {
			var event = event || window.event;
			switch (event.type) {
				case "touchstart":
					var offs = $("#chartContainer").offset();
					var elPos = {
						x: offs.left,
						y: offs.top
					};
					var mPos = {
						x: event.changedTouches[0].pageX - elPos.x,
						y: event.changedTouches[0].pageY - elPos.y
					}; //动作点相遇于canvas的坐标
					var currentX = mPos.x - radiusX / config.dpr;
					var currentY = mPos.y - radiusY / config.dpr; //以圆心作为远点，当前事件的坐标点.

					var lineWidth = config.lineWidth;

					var ang = angle * Math.PI / 180; //当前刻度的位置
					var angFrom90 = -Math.PI / 2 + ang; //弧度单位，以3点钟作为的起始
					if (angFrom90 > Math.PI / 2) {
						angFrom90 = angFrom90 - 2 * Math.PI;
					}
					var keduX = (bigRadius / config.dpr) * Math.cos(angFrom90);
					var keduY = (bigRadius / config.dpr) * Math.sin(angFrom90);
					var distance = Math.round(Math.sqrt(Math.pow(currentX - keduX, 2) + Math.pow(currentY - keduY, 2)));
					var logAry = [];
					//logAry.push("angFrom90:"+angFrom90 *180/Math.PI);
					/*
					console.log("keduX:"+keduX);
					console.log("keduY:"+keduY);
					console.log("currentX:"+currentX);
					console.log("currentY:"+currentY);
					console.log("distance:"+distance);
					logAry.push("mPos.x:"+mPos.x);
					logAry.push("mPos.y:"+mPos.y);
					logAry.push("currentX:"+currentX);
					logAry.push("currentY:"+currentY);
					logAry.push("distance:"+distance);
					log(logAry);*/
					if (distance < 50) {
						mHold = 1;
						event.preventDefault();
					}
					_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_circleTabStart']);

					break;
				case "touchend":
					mHold = 0;
					_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_circleTabEnd']);
					break;
				case "touchmove":

					if (mHold) {
						event.preventDefault();
						var offs = $("#chartContainer").offset();
						var elPos = {
							x: offs.left,
							y: offs.top
						};
						//console.log("...........................");
						var mPos = {
							x: event.changedTouches[0].pageX - elPos.x,
							y: event.changedTouches[0].pageY - elPos.y
						};
						var currentX = mPos.x - radiusX / config.dpr;
						var currentY = mPos.y - radiusY / config.dpr;
						var atan = Math.atan2(currentX, currentY);
						var deg = -atan / PI2 + 180;

						deg = Math.floor(deg);
						/*
						var logAry = [];
						logAry.push("mPos.x:"+mPos.x);
						logAry.push("mPos.y:"+mPos.y);
						logAry.push("currentX:"+currentX);
						logAry.push("currentY:"+currentY);
						log(logAry);
						*/

						if (lastX <= 0 && lastY >= 0) { //防止从左侧滑动到右侧
							if (currentX > 0 && currentY > 0) {

								lastX = -radiusX / config.dpr;
								lastY = radiusY / config.dpr;
								angle = MIN_ANGLE_DEGREE;

								drawFace(ctx, radius, angle);
								return;
							}
						}
						if (lastX >= 0 && lastY >= 0) { //防止从右侧滑动到左侧
							if (currentX < 0 && currentY > 0) {

								lastX = radiusX / config.dpr;
								lastY = radiusY / config.dpr;
								angle = MAX_ANGLE_DEGREE;

								drawFace(ctx, radius, angle);
								return;
							}
						}
						if (currentX > 0 && currentY > 0) {
							if (deg >= MAX_ANGLE_DEGREE) {
								deg = MAX_ANGLE_DEGREE;
							}
						}
						if (currentX <= 0 && currentY > 0) {
							if (deg <= MIN_ANGLE_DEGREE) {
								deg = MIN_ANGLE_DEGREE;
							}
						}



						angle = deg;
						lastX = currentX;
						lastY = currentY;
						drawFace(ctx, radius, angle);

					}
					break;
			}
		}
	}


	function drawZhiZhen(ctx, angle, width, startR, endR, color) {
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.moveTo(startR * Math.cos(angle), startR * Math.sin(angle));
		ctx.lineTo(endR * Math.cos(angle), endR * Math.sin(angle));
		ctx.stroke();
	}

	function drawWord(ctx, angle, color, radius, word, rotate) {
		ctx.textAlign = "center";
		ctx.font = "normal 40px Arial,Microsoft YaHei";
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

	function drawBg(ctx) { //背景是指示标

		//画灰色圆环
		ctx.beginPath();
		ctx.arc(0, 0, bigRadius, MIN_ANGLE, MAX_ANGLE);
		ctx.lineWidth = config.lineWidth;
		ctx.strokeStyle = "#e0e0e0";
		ctx.stroke();

		//画蓝色指示按钮
		var tipRadius = bigRadius - 80;
		var tipMaxAngle = MIN_ANGLE + 0.7;
		ctx.beginPath();
		ctx.arc(0, 0,tipRadius, MIN_ANGLE, tipMaxAngle);
		ctx.lineWidth = 8;
		ctx.strokeStyle = "#588dd4";
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 9;
		ctx.strokeStyle = "#588dd4";
		ctx.moveTo(tipRadius * Math.cos(tipMaxAngle), tipRadius * Math.sin(tipMaxAngle));
		ctx.lineTo((tipRadius-9) * Math.cos(tipMaxAngle-0.15), (tipRadius-9) * Math.sin(tipMaxAngle-0.15));
		ctx.stroke();




		var max_width = 6;
		var min_width = 3;
		var dur = (MAX_ANGLE - MIN_ANGLE) / 40;
		//画刻度指针	
		for (var i = MIN_ANGLE; i < MAX_ANGLE; i = i + dur) {
			drawZhiZhen(ctx, i, min_width, smallRadius - 5, smallRadius - 20, "#cccccc");
		}
		for (var i = MIN_ANGLE; i <= MAX_ANGLE; i = i + 8 * dur) {
			drawZhiZhen(ctx, i, max_width, smallRadius - 5, smallRadius - 30, "#588dd4");
		}

		//画文字
		drawWord(ctx, MIN_ANGLE + 24 * dur, "#ff7550", smallRadius - 80, "基本", 30 * Math.PI / 180);
		drawWord(ctx, MIN_ANGLE + 32 * dur, "#ff7550", smallRadius - 80, "推荐", 0);
		drawWord(ctx, MIN_ANGLE + 40 * dur, "#ff7550", smallRadius - 80, "无忧", -30 * Math.PI / 180);

		//起始点的灰色圆角
		ctx.beginPath();
		var textX = (radius + config.lineWidth / 2) * Math.cos(MIN_ANGLE);
		var textY = (radius + config.lineWidth / 2) * Math.sin(MIN_ANGLE);
		ctx.arc(textX, textY, 30, 0, TWO_PI, false);
		ctx.fillStyle = "#e0e0e0";
		ctx.fill();

		//结束点的灰色圆角
		ctx.beginPath();
		var textX = (radius + config.lineWidth / 2) * Math.cos(MAX_ANGLE);
		var textY = (radius + config.lineWidth / 2) * Math.sin(MAX_ANGLE);
		ctx.arc(textX, textY, 30, 0, TWO_PI, false);
		ctx.fillStyle = "#e0e0e0";
		ctx.fill();

	}

	function clearCircle(context, x, y, radius) {
		context.save();
		context.globalCompositeOperation = 'destination-out';
		context.beginPath();
		context.arc(x, y, radius, 0, 2 * Math.PI, false);
		context.fill();
		context.restore();
	};

	var lastScore;

	function drawFace(ctx, radius, angle) {

		/*
		if (angle < 0) {
			angle = 0;
		}
		if (angle > 360) {
			angle = 360;
		}*/


		clearCircle(ctx, 0, 0, radius + 100);

		var ang = angle * Math.PI / 180; //弧度单位，以12点作为起始 
		var angFrom90 = -Math.PI / 2 + ang; //弧度单位，以3点钟作为的起始
		if (angFrom90 > Math.PI / 2) {
			angFrom90 = angFrom90 - 2 * Math.PI;
		}

		var lineWidth = config.lineWidth;



		//if(angle>225){
		//起始点的蓝色圆角
		ctx.beginPath();
		var textX = (radius + config.lineWidth / 2) * Math.cos(MIN_ANGLE);
		var textY = (radius + config.lineWidth / 2) * Math.sin(MIN_ANGLE);
		ctx.arc(textX, textY, config.lineWidth / 2, 0, TWO_PI, false);
		ctx.fillStyle = "#588dd4";
		ctx.fill();



		ctx.beginPath();
		ctx.arc(0, 0, smallRadius + lineWidth / 2, MIN_ANGLE, angFrom90, false); //当前蓝色已滑动的区域
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = '#588dd4';
		ctx.stroke();

		//当前刻度圆环的画法

		var keduRadius = smallRadius + lineWidth / 2;
		var cosX = Math.cos(angFrom90);
		var sinX = Math.sin(angFrom90);
		var keduX = keduRadius * cosX;
		var keduY = keduRadius * sinX;

		ctx.beginPath();
		ctx.arc(keduX, keduY, 40, 0, TWO_PI, false); //当前刻度
		ctx.fillStyle = "#91bce8";
		ctx.fill();


		ctx.beginPath();
		ctx.arc(keduX, keduY, 37, 0, TWO_PI, false); //当前刻度
		ctx.fillStyle = "#fff";
		ctx.fill();


		var score = 0;

		if (angle >= MIN_ANGLE_DEGREE && angle <= 360) {
			score = Math.round((angle - MIN_ANGLE_DEGREE) / 30);
		}

		if (angle <= MAX_ANGLE_DEGREE && angle >= 0) {
			score = Math.round((angle + 150) / 30);
		}
		//console.log("angle..."+angle);
		//console.log("score..."+score);
		if (score !== lastScore) {


			console.log("...........");
			scoreObj.fanweiScore = score;
			updateSumScore();
			var showScore = baozhang_score[score] || 0;
			if (showScore > 0 && showScore < 10) {
				showScore = showScore.toFixed(1);
			}
			$("#fanwei_score").html(showScore);
			//$('#clockContainer').scope().fanweiScore = score;
			//change(score);

			changeText(score);
		}
		lastScore = score;


	}

	function changeText(score) {
		//var score = scoreNo-1;
		//console.log(baozhang_tiaojian);
		if (score > 0) {
			$("#default_text").fadeOut();
		} else {
			$("#chartTextContainer").find("div").stop().animate({
				opacity: 0
			}, function() {
				$("#default_text").fadeIn();
			})
			return;
		}
		if (baozhang_tiaojian && baozhang_tiaojian[score] && baozhang_tiaojian[score].length > 0) {
			if (baozhang_tiaojian[score][0] == "") {
				return;
			}
			updateMoney(score);
			var largeText = baozhang_tiaojian[score][0];

			$("#chartTextContainer").find("div:eq(2)").stop().animate({
				opacity: 1
			}).html(largeText);
			if (baozhang_tiaojian[score][1]) {
				$("#chartTextContainer").find("div:eq(1)").stop().animate({
					opacity: 1
				}).html(baozhang_tiaojian[score][1]);
			} else {
				$("#chartTextContainer").find("div:eq(1)").stop().animate({
					opacity: 0
				});
			}
			if (baozhang_tiaojian[score][2]) {
				$("#chartTextContainer").find("div:eq(0)").stop().animate({
					opacity: 1
				}).html(baozhang_tiaojian[score][2]);
			} else {
				$("#chartTextContainer").find("div:eq(0)").stop().animate({
					opacity: 0
				});
			}
			if (baozhang_tiaojian[score][3]) {
				$("#chartTextContainer").find("div:eq(3)").stop().animate({
					opacity: 1
				}).html(baozhang_tiaojian[score][3]);
			} else {
				$("#chartTextContainer").find("div:eq(3)").stop().animate({
					opacity: 0
				});
			}
			if (baozhang_tiaojian[score][4]) {
				$("#chartTextContainer").find("div:eq(4)").stop().animate({
					opacity: 1
				}).html(baozhang_tiaojian[score][4]);
			} else {
				$("#chartTextContainer").find("div:eq(4)").stop().animate({
					opacity: 0
				});
			}
		}



	}


	return {
		init: init
	}

})();