$(function() {
	'use strict';
	var MIN_AGE = 0;
	var MAX_AGE = 120;
	var AGE_DURATION = 5; //间隔5年一个大一点的刻度
	var START_AGE = 30;
	var YEAR_DIS = 18; //1年间隔13个像素。调整css会修改。
	var NEEDLE_LEFT = 151;
	var DEFAULT_AGE = Math.floor(NEEDLE_LEFT / YEAR_DIS); //默认尺子在最左边，指针指到的年龄为12岁。
	var html = [];
	var startX;
	var minLeft;
	var maxLeft;
	var bgLeft;
	var transFormX = 0;



	(function init() {
		drawBg();
		//maxLeft = $("#pointer").position().left; //指针为正值能移动的最左边
		maxLeft = NEEDLE_LEFT;
		minLeft = maxLeft - YEAR_DIS * (MAX_AGE - MIN_AGE); //指针能移动的最右边，为负值
		transFormX = maxLeft - START_AGE * YEAR_DIS;
		console.log("minLeft:" + minLeft);
		console.log("maxLeft:" + maxLeft);
		$("#pointer").css("left", NEEDLE_LEFT);
		$("#age").html(START_AGE);
		setTransfrom(transFormX);
		bindEvent();

	})();

	function setTransfrom(transFormDis) {
		var ele = document.getElementById("bg");
		var age = Math.round(DEFAULT_AGE - (transFormDis / YEAR_DIS));
		$("#age").html(age);
		var ageDis = maxLeft - age * YEAR_DIS;
		ele.style.webkitTransform = ele.style.transform = 'translateX(' + ageDis + 'px)';
	}

	function drawBg() {
		for (var i = 0; i <= MAX_AGE; i++) {
			if (i % AGE_DURATION !== 0) {
				html.push("<a></a>");
			} else {
				html.push('<a class="high"><span>' + i + '</span></a>');
			}
		}
		$("#bg").html(html.join(""));
	}

	function bindEvent() {
		var ele = document.getElementById("slider-container");
		ele.addEventListener('touchstart', touchHandler, false);
		ele.addEventListener('touchmove', touchHandler, false);
		ele.addEventListener('touchend', touchHandler, false);
		/*
		$("#slider-container").on('touch', touchHandler).on('touchmove', touchHandler).on("touchend", touchHandler);
		*/
		function resetLeft(dis) {
			var ret = dis;
			ret = ret < minLeft ? minLeft : ret;
			ret = ret > maxLeft ? maxLeft : ret;

			/*
			console.log("minLeft:"+minLeft);
			console.log("maxLeft:"+maxLeft);
			console.log("dis:"+dis);
			console.log("ret:"+ret);
			*/
			return ret;
		}

		function touchHandler(event) {
			var event = event || window.event;
			switch (event.type) {
				case "touchstart":
					event.preventDefault();
					startX = event.touches[0].clientX;
					break;
				case "touchend":
					event.preventDefault();
					var eventDis = event.changedTouches[0].clientX - startX;
					transFormX = resetLeft(transFormX+ eventDis*0.8);
					break;
				case "touchmove":
					event.preventDefault();
					var eventDis = event.touches[0].clientX - startX;
					setTransfrom(resetLeft(transFormX + eventDis*0.8));
					break;
			}
		}
	}
})