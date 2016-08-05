var SLIDER = (function() {


	function init(type) {
		insuranceType = type;
	}
	var barWidth = 0;
	var insuranceType;
	var sliderIndex = 0;
	var baxMax = $("#customerSlider").find(".weui_progress_bar").width() - 16;
	// var partentMax = $("#customerSlider").find(".weui_progress_bar").width();
	load();

	function reset() {
		barWidth = 0;
		updateScore(0);
	}
	function updateInsured(){
			var kedus = $("#customerSlider").find(".kedu").find("p");
				var html = $(kedus[sliderIndex]).html().replace("(万)","");
				scoreObj.insuredMoney = parseInt(html)*10000;
				$("#money_score").html(html);	
	}
	function updateScore(width) {
		if (width >= 0) {
			var moneyScore = Math.round(width * 10 / baxMax);
			if(moneyScore%2==0){
				scoreObj.moneyScore = moneyScore;
				var showScore = moneyScore;
				if(moneyScore>0 && moneyScore<10){
					showScore = moneyScore+".0";
				}
				sliderIndex  = moneyScore/2;

				updateInsured();
				var newWidth = moneyScore /10 * baxMax;

				 $("#bar").width(newWidth);

				 $("#zhizhen").css("left", newWidth-24);
				// $("#bar").width(width);
				// $("#zhizhen").css("left", newWidth - 26);
			}
		}
	}

	function checkScore() {
		if (scoreObj.fanweiScore == 0) {
			util.showToastJQ("请先选择保障范围");
			return false;
		}
		return true;
	}

	function load() {
		document.getElementById("zhizhen").addEventListener('touchstart', touch, false);
		document.getElementById("zhizhen").addEventListener('touchmove', touch, false);
		document.getElementById("zhizhen").addEventListener('touchend', touch, false);


		var startX;

		var barMin = 0;
		var isOk = false;

		function touch(event) {
			var event = event || window.event;
			switch (event.type) {
				case "touchstart":
					isOk = checkScore();
					event.preventDefault();
					event.stopPropagation();
					baxMax = $("#customerSlider").find(".weui_progress_bar").width() - 16;
					startX = event.touches[0].clientX;
					_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabStart']);
					break;
				case "touchend":
					if (!isOk) {
						return false;
					}
					_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabEnd']);
					event.preventDefault();
					event.stopPropagation();
					var dis = event.changedTouches[0].clientX - startX;
					barWidth = barWidth + dis;
					var drawDis = barWidth;
					if (drawDis <= barMin) {
						drawDis = 0;
						barWidth = 0;
					}
					if (drawDis >= baxMax) {
						drawDis = baxMax;
					}

					updateScore(drawDis);
					updateSumScore(insuranceType);


					break;
				case "touchmove":
					if (!isOk) {
						return false;
					}
					event.preventDefault();
					event.stopPropagation();
					var dis = event.touches[0].clientX - startX;
					var drawDis = barWidth + dis;

					if (drawDis <= barMin) {
						drawDis = 0;
						barWidth = 0;
					}

					if (drawDis >= baxMax) {
						drawDis = baxMax;
					}

					updateScore(drawDis);
					/*
					var items = $(".kedu");
					var index = Math.floor(scoreObj.moneyScore/2-1);
					*/
					break;
			}
		}
	}


	return {
		init: init,
		reset: reset,
		updateInsured:updateInsured
	}

})();