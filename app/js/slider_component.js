(function() {



	var html = {

		main: [
			'<div class="slider"><div class="progress_bar" >',
			'<div class="progress_inner_bar">',
			'<div  class="zhizhen">',
			'<img src="/img/slider-btn.png?v=2"  class="bar_btn" >',
			'</div>',
			'</div>',
			'{tipHtml}',
			'</div></div>'
		].join(''),
		tip: [
			'<div class="kedu" style="left:{left}">',
			'<div class="zz"></div>',
			'<p>{text}</p>',
			'</div>'
		].join(''),
		blueTip: [

			'<div class="kedu"  style="left:{left}">',
			'<div class="small-zz"></div>',
			'</div>'
		].join('')

	};
	var ZHIZHEN_OFFSET = 25;

	function Slider(config) {

		// var config = {};
		var config = config;
		this.get = function(n) {
			return config[n];
		}
		this.set = function(n, v) {
			config[n] = v;
		}
		this.startX = 0;
		this.barWidth = 0;
		this.barMin = 0;
		this.barMax = 0;
		this.init();
		this.getMax();

	};
	Slider.prototype = {

		init: function() {
			this.creatDom();
			this.bindEvent();
		},
		creatDom: function() {
			var content = html['main'];
			var tipHtml = [];

			var textArray = this.get("text");
			console.log(textArray);
			var number = (textArray.length - 1) * 4;
			var leftPercent = 97 / number;
			for (var i = 0; i <= number; i++) {
				var currentHtml = '';
				if (i % 4 == 0) {
					currentHtml = html['tip'];
					var index = i / 4;

					var text = textArray[index];

					if (textArray.length - 1 == index) {
//						text += "(年)";
						text += "("+this.get("danwei")+")";
					}
					// if(i==20){
					// 	text +="(年)";
					// }
					if (text == null) {
						text = "";
					}
					currentHtml = currentHtml.replace('{text}', text);


				} else {
					currentHtml = html['blueTip'];
				}
				var left = 2 + i * leftPercent;
				currentHtml = currentHtml.replace('{left}', left + "%");
				tipHtml.push(currentHtml);
			}
			content = content.replace('{tipHtml}', tipHtml.join(''));
			$(this.get("id")).html(content);
		},
		getMax: function() {
			this.barMax = $(this.get("id")).find(".progress_bar").width() - 10;
		},
		updateText:function(text){
			this.set("text",text);
			this.creatDom();
		},
		drawSlider: function(width, isEnd) {

			var moneyScore = Math.round((width * 100) / this.barMax); //100以内的比例

			var textArray = this.get("text");
			var number = Math.round(100 / (textArray.length - 1));


			var xishu = Math.ceil(moneyScore / number);
			if (xishu <= textArray.length - 1) {
				var newWidth = xishu * number * this.barMax / 100;
				$(this.get("id")).find(".progress_inner_bar").width(newWidth);
				$(this.get("id")).find(".zhizhen").css("left", newWidth - ZHIZHEN_OFFSET);
				if (typeof this.get("callback") == "function" ) {
					this.get("callback")(this.get("text")[xishu],isEnd);
				}
			}

		},
		bindEvent: function() {
			var _this = this; //保存this对象，否则事件callback里会将this认为是dom

			console.log("bindEvent....:" + this.get("id"));
			$(_this.get("id")).on("touchstart", ".zhizhen", function(event) {

				console.log("touch start.....................");

				var touchEvent = event.originalEvent.targetTouches[0];
				event.preventDefault();
				event.stopPropagation();
				_this.startX = touchEvent.clientX;
				_this.getMax();
				//_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabStart']);
			});

			$(_this.get("id")).on("touchmove", ".zhizhen", function(event) {

				var touchEvent = event.originalEvent.targetTouches[0];
				event.preventDefault();
				event.stopPropagation();

				var moveDis = touchEvent.clientX - _this.startX;
				var drawDis = _this.barWidth + moveDis;

				if (drawDis <= _this.barMin) {
					drawDis = 0;
					_this.barWidth = 0;
				}

				if (drawDis >= _this.barMax) {
					drawDis = _this.barMax;
				}
				_this.drawSlider(drawDis, false);
				_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabMove']);
			});


			$(_this.get("id")).on("touchend", ".zhizhen", function(event) {


				var touchEvent = event.originalEvent.targetTouches[0];
				event.preventDefault();
				event.stopPropagation();

				var dis = event.originalEvent.changedTouches[0].clientX - _this.startX;
				_this.barWidth = _this.barWidth + dis;
				var drawDis = _this.barWidth;
				if (drawDis <= _this.barMin) {
					drawDis = 0;
					_this.barWidth = 0;
				}
				if (drawDis >= _this.barMax) {
					drawDis = _this.barMax;
				}
				_this.drawSlider(drawDis, true);
				//_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabMove']);

				_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabEnd']);

			});
		}
	}
	window.Slider = Slider;
})();