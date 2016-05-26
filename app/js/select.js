//$(function() {
var CIRCLE = (function() {

	var config = {
		marginTop: 20,
		padding: 31,
		lineWidth: 30,
		closePadding: 40,
		dpr: 3
	};
	var baozhang_tiaojian = {
		//0:["顺时针滑动提升分数"]

	};
	var baozhang_money = {
		0:['20','40','60','80','100']
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
	function updateMoney(score){
		if(baozhang_money && baozhang_money[score] && baozhang_money[score]!=""){
			console.log("update...");
			console.log(baozhang_money[score]);
			var kedus = $("#customerSlider").find(".kedu");
			for(var i = 0 ;i<kedus.length;i++){
				$(kedus[i]).find("p").html(baozhang_money[score][i]+"万");
			}
		}
	}
	function init(tiaojian,money){

		baozhang_tiaojian = tiaojian;
		baozhang_money = money;
		//$scope = scope;
		changeText(0);	

	}
	
	var MIN_ANGLE = -Math.PI / 2;
	var MAX_ANGLE = 3 * Math.PI / 2;
	var TWO_PI = 2 * Math.PI;
	var angle = 0;
	var bgCanvas = document.getElementById("bgchartContainer");
	var canvas = document.getElementById("chartContainer");
	var width = $(document).width() - config.padding;
	console.log("document width:" + $(document).width());
	//if (width > 500) {
	//	width = 500;
	//}
	var height = parseInt(width) + config.marginTop;
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
	var radiusY = (canvas.height) / 2;
	var mHold = 0;
	ctx.translate(radiusX, radiusY);
	ctxBg.translate(radiusX, radiusY);
	radius = radius * 0.75;
	var smallRadius = radius;
	var bigRadius = radius + config.lineWidth;

	drawFace(ctx, radius, angle);
	load();
	drawBg(ctxBg);
	var text_width = canvas.width * 0.5;
	$(".canvas_text").css({
		'left': (radiusX) / config.dpr,
		'top': (radiusY - radius / 2) / config.dpr,
		'width': text_width / config.dpr,
		"margin-left": -text_width / (2 * config.dpr)
	})

	function load() {
		document.getElementById("clockContainer").addEventListener('touchstart', touch, false);
		document.getElementById("clockContainer").addEventListener('touchmove', touch, false);
		document.getElementById("clockContainer").addEventListener('touchend', touch, false);

		//var startX;
		//var startY;
		var offs = $("#chartContainer").offset();
		var elPos = {
			x: offs.left,
			y: offs.top
		};
		var PI2 = Math.PI / 180;
		var lastX = 0;
		var lastY = 0;

		function touch(event) {
			var event = event || window.event;
			switch (event.type) {
				case "touchstart":

					var mPos = {
						x: event.changedTouches[0].pageX - elPos.x,
						y: event.changedTouches[0].pageY - elPos.y
					}; //动作点相遇于canvas的坐标
					var currentX = mPos.x - radiusX / config.dpr;
					var currentY = mPos.y - radiusY / config.dpr; //以圆心作为远点，当前事件的坐标点.
					//var dis = Math.round(Math.sqrt(Math.pow(currentX, 2) + Math.pow(currentY, 2))); //当前事件半径
					//var atan = Math.atan2(currentX, currentY); //返回从0度到当前坐标逆时针所转的角度 单位是弧度。注意这里将x，y坐标调换，然后转化成为从（0，y）开始的角度
					//var deg = -atan / PI2 + 180; //转化成度数，
					//alert("deg:"+deg)
					//alert("angle:"+angle)

					/*
					if (Math.abs(deg - angle) < 30 && Math.abs(dis - radius / config.dpr) < 250) {
						mHold = 1;
					}*/
					//console.log("deg:" + deg);

					var ang = angle * Math.PI / 180; //当前刻度的位置
					var keduRadius = (radius + config.lineWidth / 2);
					var keduX = (keduRadius / config.dpr) * Math.cos(-Math.PI / 2 + ang);
					var keduY = (keduRadius / config.dpr) * Math.sin(-Math.PI / 2 + ang);
					var distance = Math.round(Math.sqrt(Math.pow(currentX - keduX, 2) + Math.pow(currentY - keduY, 2)));

					if (distance < 60) {
						mHold = 1;
						event.preventDefault();
					}
					_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_circleTabStart']);
					//console.log("newDeg:" + (Math.atan2(currentY, currentX) / PI2));

					/*
					console.log("screenX:" + event.changedTouches[0].screenX);
					console.log("pageX:" + event.changedTouches[0].pageX);
					console.log("pageY:" + event.changedTouches[0].pageY);
					console.log("clientX:" + event.changedTouches[0].clientX);
					console.log("clientY:" + event.changedTouches[0].clientY);
					*/
					/*
					var ang = deg * Math.PI / 180;
					var keduRadius = (radius + config.lineWidth / 2);
					console.log("deg:" + deg);
					console.log("angle:" + angle);
					console.log("currentX:" + (currentX));
					console.log("currentY:" + (currentY));
					console.log("keduX:" + (keduRadius/config.dpr)* Math.cos(-Math.PI / 2 + ang));
					console.log("keduY:" + (keduRadius/config.dpr) * Math.sin(-Math.PI / 2 + ang));*/
					/*
					console.log("deg:" + deg);
					console.log("dis:" + dis);
					console.log("radius:" + radius / config.dpr);
					console.log("angle:" + angle);
					console.log("currentX:" + (currentX));
					console.log("currentY:" + (currentY));
					console.log("kedu:" + (radius + config.lineWidth / 2) * Math.cos(-Math.PI / 2 + angle));
					console.log("kedu:" + (radius + config.lineWidth / 2) * Math.sin(-Math.PI / 2 + angle));
					console.log("Touch started (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")");
					*/

					break;
				case "touchend":
					//console.log("<br/>Touch end (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")");
					mHold = 0;
					_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_circleTabEnd']);
					break;
				case "touchmove":

					if (mHold) {
						event.preventDefault();
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

						if (lastX < 0 && lastY < 0) { //防止从左侧滑到右侧
							if (currentX >= 0 && currentY <= 0 || currentX > 0 && currentY > 0) {
								lastX = -0.01;
								lastY = -radiusY / config.dpr;
								angle = 360;
								drawFace(ctx, radius, 360);
								return;
							}
						}
						if (lastX >= 0 && lastY <= 0) { //防止从右侧滑动到左侧
							if (currentX < 0 && currentY < 0 || currentX < 0 && currentY > 0) {

								lastX = 0.01;
								lastY = -radiusY / config.dpr;
								angle = 0;

								drawFace(ctx, radius, 0);
								return;
							}
						}

						/*
						console.log(mPos);
						console.log("atanX:" + (currentX));
						console.log("atanY:" + (currentY));
						console.log("atan:" + atan);
						console.log("deg:" + deg);
						console.log("angle:" + angle);
						console.log("drawAngle:" + drawAngle);
						*/
						angle = deg;
						lastX = currentX;
						lastY = currentY;
						drawFace(ctx, radius, angle);
						//console.log("<br/>Touch moved (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")");
					}
					break;
			}
		}
	}


	function drawZhiZhen(ctx, angle, width, startR, endR) {
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.strokeStyle = '#535353';
		ctx.moveTo(startR * Math.cos(angle), startR * Math.sin(angle));
		ctx.lineTo(endR * Math.cos(angle), endR * Math.sin(angle));
		ctx.stroke();
	}

	function drawWord(ctx, angle, color, radius_score, score) {
		ctx.textAlign = "center";
		//var textRadius = smallRadius - 2*config.closePadding;
		ctx.font = "normal 40px Arial,Microsoft YaHei";
		//ctx.fillStyle = "#535353";
		ctx.fillStyle = color;
		var textX = (radius_score) * Math.cos(angle);
		var textY = (radius_score) * Math.sin(angle);
		ctx.fillText(score, textX, textY);

		// textRadius = smallRadius - 3*config.closePadding;
		/*
		ctx.font = "normal 40px Arial,Microsoft YaHei";
		ctx.fillStyle = "#ff7550";
		var textX = (radius_word) * Math.cos(angle);
		var textY = (radius_word) * Math.sin(angle);
		ctx.fillText(word, textX, textY);*/


	}

	function drawBg(ctx) { //背景是指示标



		//画灰色圆环

		ctx.beginPath();
		ctx.arc(0, 0, bigRadius, 0, TWO_PI);
		ctx.fillStyle = "#e0e0e0";
		ctx.fill();

		ctx.beginPath();
		ctx.arc(0, 0, smallRadius, 0, TWO_PI);
		ctx.fillStyle = "#fff";
		ctx.fill();


		//画提示弧线
		var angleMin = -Math.PI / 4;
		var indrodRadius = config.lineWidth + radius + 50;
		ctx.beginPath();
		ctx.arc(0, 0, indrodRadius, -Math.PI / 2, angleMin);
		ctx.strokeStyle = '#bdd7f1';
		ctx.lineWidth = 12;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(indrodRadius * Math.cos(angleMin), indrodRadius * Math.sin(angleMin));
		ctx.lineTo(indrodRadius * Math.cos(angleMin) - 40, indrodRadius * Math.sin(angleMin) - 70);
		ctx.stroke();

		var max_width = 6;
		var min_width = 3;
		//画刻度
		drawZhiZhen(ctx, -Math.PI / 2, max_width, smallRadius - config.closePadding, smallRadius); //0
		drawZhiZhen(ctx, -Math.PI / 2 + Math.PI / 5, min_width, smallRadius - config.closePadding / 2, smallRadius);
		drawZhiZhen(ctx, -Math.PI / 2 + 2 * Math.PI / 5, min_width, smallRadius - config.closePadding / 2, smallRadius);
		drawZhiZhen(ctx, -Math.PI / 2 + 3 * Math.PI / 5, min_width, smallRadius - config.closePadding / 2, smallRadius);
		drawZhiZhen(ctx, -Math.PI / 2 + 4 * Math.PI / 5, min_width, smallRadius - config.closePadding / 2, smallRadius);
		drawZhiZhen(ctx, Math.PI / 2, max_width, smallRadius - config.closePadding, smallRadius); //5
		drawZhiZhen(ctx, Math.PI / 5 + Math.PI / 2, min_width, smallRadius - config.closePadding / 2, smallRadius);
		drawZhiZhen(ctx, 2 * Math.PI / 5 + Math.PI / 2, min_width, smallRadius - config.closePadding / 2, smallRadius);
		drawZhiZhen(ctx, 3 * Math.PI / 5 + Math.PI / 2, max_width, smallRadius - config.closePadding, smallRadius); //5
		drawZhiZhen(ctx, 4 * Math.PI / 5 + Math.PI / 2, min_width, smallRadius - config.closePadding / 2, smallRadius);


		drawWord(ctx, -Math.PI / 2, "#535353", smallRadius - 2 * config.closePadding, "10分");
		drawWord(ctx, -Math.PI / 2, "#ff7550", smallRadius - 3 * config.closePadding, "无忧");

		drawWord(ctx, Math.PI / 2, "#535353", smallRadius - config.closePadding - 10, "5分");
		drawWord(ctx, Math.PI / 2, "#ff7550", smallRadius - 2 * config.closePadding - 15, "基本");

		drawWord(ctx, Math.PI / 2 + 3 * Math.PI / 5 + 0.05, "#535353", smallRadius - config.closePadding - 50, "8分");
		drawWord(ctx, Math.PI / 2 + 3 * Math.PI / 5 - 0.1, "#ff7550", smallRadius - 2 * config.closePadding - 25, "推荐");

		//drawWord(ctx,Math.PI / 2,smallRadius - config.closePadding-10,"5分",smallRadius - 2*config.closePadding-15,"基本");
		//drawWord(ctx,Math.PI / 2 + 3*Math.PI/5,"8分","推荐");


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

		if (angle < 0) {
			angle = 0;
		}
		if (angle > 360) {
			angle = 360;
		}



		//ctx.clearRect(0, 0, bigRadius, bigRadius);

		clearCircle(ctx, 0, 0, bigRadius + 35);
		//ctx.beginPath();
		//ctx.arc(0, 0, bigRadius + 35, 0, 2 * Math.PI);

		//ctx.fillStyle = "#fff";
		//ctx.fill();



		/*
		ctx.beginPath();
		ctx.arc(0, 0, bigRadius, 0, TWO_PI);
		ctx.fillStyle = "#e0e0e0";
		ctx.fill();



		ctx.beginPath();
		ctx.arc(0, 0, smallRadius, 0, TWO_PI);
		ctx.fillStyle = "#fff";
		ctx.fill();
		*/


		var ang = angle * Math.PI / 180;
		var angFrom90 = -Math.PI / 2 + ang;


		ctx.beginPath();
		ctx.arc(0, 0, smallRadius + config.lineWidth / 2, MIN_ANGLE, angFrom90, false); //当前大圆环的刻度
		ctx.lineWidth = config.lineWidth;
		ctx.strokeStyle = '#247ad1';
		ctx.stroke();


		/*
	    ctx.beginPath();
		ctx.arc(0, 0, smallRadius + config.lineWidth / 2, angFrom90,MAX_ANGLE , false); //当前大圆环的刻度灰色
		ctx.lineWidth = config.lineWidth;
		ctx.strokeStyle = '#e0e0e0';
		ctx.stroke();
*/


		//	console.log("angle:" + angle);


		ctx.beginPath();
		ctx.arc(0, 0, smallRadius - config.closePadding, MIN_ANGLE, angFrom90, false); //内环线蓝色
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#3282d4';
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(0, 0, smallRadius - config.closePadding, angFrom90, MAX_ANGLE, false); //内环线灰色
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#e7e7e7';
		ctx.stroke();



		//当前刻度圆环的画法
		var keduRadius = smallRadius + config.lineWidth / 2;
		var cosX = Math.cos(angFrom90);
		var sinX = Math.sin(angFrom90);
		var keduX = keduRadius * cosX;
		var keduY = keduRadius * sinX;

		ctx.beginPath();
		ctx.arc(keduX, keduY, 40, 0, TWO_PI, false); //当前刻度
		ctx.fillStyle = "#91bce8";
		ctx.fill();


		ctx.beginPath();
		ctx.arc(keduX, keduY, 20, 0, TWO_PI, false); //当前刻度
		ctx.fillStyle = "#fff";
		ctx.fill();


		var score = Math.round(angle / 36);
		if (score !== lastScore) {

			 console.log("...........");
		
			scoreObj.fanweiScore = score;
			updateSumScore();
			$("#fanwei_score").html(score);
			//$('#clockContainer').scope().fanweiScore = score;
			//change(score);
		
			changeText(score);
		}
		lastScore = score;
		/*
		if(score===2){
			$("#chartTextContainer").find("div:eq(0)").animate({ opacity: 1 });
			$("#chartTextContainer").find("div:eq(2)").animate({ opacity: 0 });
		}
		if(score===3){
			$("#chartTextContainer").find("div:eq(3)").animate({ opacity: 1 });
			$("#chartTextContainer").find("div:eq(4)").animate({ opacity: 0 });
		}*/
		/* */
		//console.log("angle:" + ang);
		//console.log("keduX:" + keduRadius * Math.cos(-Math.PI / 2 + ang));
		//console.log("keduY:" + keduRadius * Math.sin(-Math.PI / 2 + ang));


		//当前的百分比得分
		/*
		ctx.textAlign = "right";
		var textRadius = bigRadius + 55;
		ctx.font = "normal 50px Arial,Microsoft YaHei";
		ctx.fillStyle = "#f65066";
		var textX = (textRadius) * cosX + 10;
		var textY = (textRadius) * sinX + 20;
		//console.log("angle:" + angle);
		ctx.fillText(Math.floor(angle / 36), textX, textY);
		*/

		//console.log("textX:" + textX);
		//console.log("textY:" + textY);

	}

	function changeText(score) {
		//var score = scoreNo-1;
		//console.log(baozhang_tiaojian);
		if(score>0){
			$("#default_text").fadeOut();
		}else{
			$("#chartTextContainer").find("div").stop().animate({
				opacity: 0
			},function(){
				$("#default_text").fadeIn();
			})
			return;
		}
		if (baozhang_tiaojian && baozhang_tiaojian[score] && baozhang_tiaojian[score].length>0) {
			if(baozhang_tiaojian[score][0]==""){
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
		/*
		if(largeElement.html()!=largeText){
			largeElement.animate({ opacity: 0 },function(){
				largeElement.html(largeText);
			});
			
			largeElement.animate({ opacity: 1 });
		}*/


	}


	return {
		init:init
	}

})();