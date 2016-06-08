var SLIDER = (function() {


	function init() {


	}
	var barWidth = 0;
	/*
	var radio = $(document).width() / 414;
	if (radio > 1) {
		radio = 1;
	}
	//console.log($(".wrapper").css("padding-left"));
	var baxMax = $(document).width() - (34 + 40 + 30) * radio; //减去wraper的padding，减去container的padding
	*/
	var baxMax = $("#customerSlider").find(".weui_progress_bar").width() - 16;
	//console.log($("#customerSlider").find(".weui_progress_bar").width());
	load();

	function reset() {
		barWidth = 0;
		$(".kedu").find(".zz").removeClass("hover");
		$(".kedu").children("p").removeClass("wordhover");
		updateScore(0);
	}

	function updateScore(width) {
		if (width >= 0) {
			var moneyScore = Math.round(width * 100 / baxMax)/10;
			scoreObj.moneyScore = moneyScore;
			$("#money_score").html(moneyScore);
			$("#bar").width(width);
			$("#zhizhen").css("left", width - 26);

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

		//document.getElementById("chartTextContainer").addEventListener('touchstart', touch, false);
		//document.getElementById("chartTextContainer").addEventListener('touchmove', touch, false);
		//document.getElementById("chartTextContainer").addEventListener('touchend', touch, false);


		var startX;

		var barMin = 0;
		var isOk = false;

		function touch(event) {
			var event = event || window.event;
			switch (event.type) {
				case "touchstart":
					isOk = checkScore();
					event.preventDefault();
					baxMax = $("#customerSlider").find(".weui_progress_bar").width() - 16;
					startX = event.touches[0].clientX;
					console.log("Touch started (" + event.touches[0].clientX + "," + event.touches[0].clientX + ")");
					_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabStart']);
					break;
				case "touchend":
					if (!isOk) {
						return false;
					}
					_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabEnd']);
					event.preventDefault();
					console.log("<br/>Touch end (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")");
					var dis = event.changedTouches[0].clientX - startX;
					//dis=dis*1.2;
					//angle = angle + dis * 360 / width;
					barWidth = barWidth + dis;
					//console.log("mov:" + dis);
					var drawDis = barWidth;
					if (drawDis <= barMin) {
						drawDis = 0;
						barWidth = 0;
					}
					console.log("drawDis:" + drawDis);
					console.log("baxMax:" + baxMax);
					if (drawDis >= baxMax) {
						drawDis = baxMax;
					}

					updateScore(drawDis);
					updateSumScore();



					//$("#bar").width(drawDis);
					//$("#zhizhen").css("left", drawDis);
					/*
					$("#btnCircle").css("left",drawDis);
					$("#bar_score").css("left",drawDis);
					$("#bar_money").css("left",drawDis-10);
					*/
					break;
				case "touchmove":
					if (!isOk) {
						return false;
					}
					event.preventDefault();
					var dis = event.touches[0].clientX - startX;
					var drawDis = barWidth + dis;

					console.log("drawDis:" + drawDis);
					console.log("barMin:" + barMin);
					console.log("baxMax:" + baxMax);

					if (drawDis <= barMin) {
						drawDis = 0;
						barWidth = 0;
					}

					if (drawDis >= baxMax) {
						drawDis = baxMax;
					}

					updateScore(drawDis);
					//updateSumScore();
					//console.log("drawDis:"+drawDis);

					var items = $(".kedu");

					/*
					var isFind = false;
					var findItem;
					for (var i = items.length - 1; i >= 0; i--) {
						var item = items[i];
						if (drawDis >= $(item).position().left && !isFind) {
							findItem = $(item);
							isFind = true;
						} else {
							$(item).find(".zz").removeClass("hover");
							$(item).children("p").removeClass("wordhover");
						}
					}*/
					var index = Math.floor(scoreObj.moneyScore/2-1);
					// $(".kedu:eq("+index+"")")
					console.log(index);
					if(index>=0){
						 $(".kedu").find(".zz").removeClass("hover");
						 $(".kedu").children("p").removeClass("wordhover");
						 $(".kedu:eq("+index+")").find(".zz").addClass("hover");
						 $(".kedu:eq("+index+")").children("p").addClass("wordhover");
					}else{
						 $(".kedu").find(".zz").removeClass("hover");
						 $(".kedu").children("p").removeClass("wordhover");
					}
					
					/*
					$(".kedu").each(function(item,val){
							console.log("item left:"+$(val).position().left);
							if(drawDis>=$(val).position().left){
								$(val).find(".zz").addClass("hover");
								$(val).children("p").addClass("wordhover");
							}else{
								$(val).find(".zz").removeClass("hover");
								$(val).children("p").removeClass("wordhover");
							}
					});*/
					/*
					if (drawDis === baxMax) {
						$(".kedu").find(".zz").removeClass("hover");
						$(".kedu").children("p").removeClass("wordhover");
						$(".kedu:last").find(".zz").addClass("hover");
						$(".kedu:last").children("p").addClass("wordhover");
					}*/

					//$("#btnCircle").css("left",drawDis);
					//$("#bar_score").css("left",drawDis);
					//$("#bar_money").css("left",drawDis-10);
					//console.log("baxMax:"+baxMax);

					break;
			}
		}
	}


	return {
		init: init,
		reset: reset
	}

})();