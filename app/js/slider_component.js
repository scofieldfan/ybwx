(function() {



	var html = {

		main: [
			'<div class="slider"><div class="progress_bar" >',
			'<div class="progress_inner_bar">',
			'<div  class="zhizhen">',
			'<img src="http://web.youbaowuxian.com/img/slider-btn.png?v=2"  class="bar_btn" >',
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

			for (var i = 0; i <= 20; i++) {
				var currentHtml = '';
				if (i % 4 == 0) {
					currentHtml = html['tip'];
					var index = i / 4;
					var text =  this.get("text")[index];
					if(i==20){
						text +="(年)";
					}
					currentHtml = currentHtml.replace('{text}',text);

				} else {
					currentHtml = html['blueTip'];
				}
				var left = 2 + i * 4.85;
				currentHtml = currentHtml.replace('{left}', left + "%");
				tipHtml.push(currentHtml);
			}
			content = content.replace('{tipHtml}', tipHtml.join(''));
			$(this.get("id")).html(content);
		},
		getMax: function() {
			this.barMax = $(this.get("id")).find(".progress_bar").width() - 10;
		},
		drawSlider: function(width) {
			
			var moneyScore = Math.round(width * 10 / this.barMax);
			var newWidth = moneyScore / 10 * this.barMax;
			if (moneyScore % 2 == 0) {
				$(this.get("id")).find(".progress_inner_bar").width(newWidth);
				$(this.get("id")).find(".zhizhen").css("left", newWidth - ZHIZHEN_OFFSET);
				if(typeof this.get("callback") == "function"){
					//this.get("callback")(moneyScore);
					this.get("callback")(this.get("text")[moneyScore/2]);
				}
			}
			

		},
		bindEvent: function() {
			var _this = this; //保存this对象，否则事件callback里会将this认为是dom
			console.log("bindEvent....:"+this.get("id"));
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
				_this.drawSlider(drawDis);
				//_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabMove']);
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
					drawDis = this.barMax;
				}
				_this.drawSlider(drawDis);
				//_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabMove']);

				//_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_squreTabEnd']);

			});
		}
	}
	window.Slider = Slider;
})();