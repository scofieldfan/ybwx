/*
 * @Author: fanzhang
 * @Date:   2016-08-04 13:59:59
 * @Last Modified by:   fanzhang
 * @Last Modified time: 2016-08-04 16:58:31
 */

'use strict';
window.AgeComponent = (function() {

	var MIN_AGE = 0;
	var MAX_AGE = 120;
	var AGE_DURATION = 5; //间隔5年一个大一点的刻度
	var START_AGE = 30;
	var YEAR_DIS = 18; //1年间隔13个像素。调整css会修改。
	var NEEDLE_LEFT = 151;
	var DEFAULT_AGE = Math.floor(NEEDLE_LEFT / YEAR_DIS); //默认尺子在最左边，指针指到的年龄为12岁。

	var minLeft;
	var maxLeft;
	var bgLeft;
	var HTML = [
		'<p class="sub-title age-title" id="{ageId}">{age}</p>',
		'<div class="age-container" id="{sliderContainerId}">',
		'		<div id="{bgContainerId}" style="left:0px;" class="bg-container">{htmlContent}</div>',
		'		<div id="{needleId}" class="needle"  style="left:{needleLeft}px;" ><a></a></div>',
		'</div>'
	].join('');

	function tpl_replace(tpl, obj) {
		if (obj == null) return '';
		var result = '';
		result = tpl.replace(/\{([\w]+)\}/gi, function(word, key) {
			if (obj[key] != undefined) {
				return obj[key];
			}
		})
		return result;
	}

	function AgeComponent(config) {
		var config = config || {};
		this.minAge = config.minAge || MIN_AGE;
		this.maxAge = config.maxAge || MAX_AGE;
		this.ageDuration = config.ageDuration || AGE_DURATION; //间隔5年一个大一点的刻度
		this.startAge = config.startAge || START_AGE;
		this.yearDis = config.yearDis || YEAR_DIS //1年间隔13个像素。调整css会修改。
		this.needleLeft = config.needleLeft || NEEDLE_LEFT;
		this.defaultAge = Math.floor(this.needleLeft / this.yearDis); //默认尺子在最左边，指针指到的年龄为12岁。
		this.age = this.startAge;
		this.maxLeft = this.needleLeft;
		this.minLeft = this.maxLeft - this.yearDis * (this.maxAge - this.minAge); //指针能移动的最右边，为负值
		this.transFormX = this.maxLeft - this.startAge * this.yearDis;
		this.containerId = config.containerId || "ageMainContainer";
		this.idObj = {
			ageId: 'ageId',
			sliderContainerId: 'sliderContainerId',
			bgContainerId: 'bgContainerId',
			needleId: 'needleId'
		};
		this.init();

	}
	AgeComponent.prototype = {
		init: function() {
			this.createDom();
			this.setPosition(this.transFormX);
			this.bindEvent();
		},
		setPosition: function(transFormDis) { //移动背景

			var age = Math.round(this.defaultAge - (transFormDis / this.yearDis));
			this.age = age;
			var ageDis = this.maxLeft - age * this.yearDis;
			// var ele = document.getElementById(this.idObj.bgContainerId);
			$("#" + this.idObj.ageId).html(age);
			$("#"+this.idObj.bgContainerId).css("transform",'translateX(' + ageDis + 'px)');
			// ele.style.webkitTransform = ele.style.transform = 'translateX(' + ageDis + 'px)';
		},
		createDom: function() {
			var html = [];
			for (var i = 0; i <= this.maxAge; i++) {
				if (i % this.ageDuration !== 0) {
					html.push('<a style="width:'+this.yearDis+'px"></a>');
				} else {
					html.push('<a class="high"  style="width:'+this.yearDis+'px"><span>' + i + '</span></a>'); //比较粗的指针
				}
			}
			var renderObj = $.extend(this.idObj, {
				htmlContent: html.join(""),
				age: this.age,
				needleLeft: this.needleLeft
			});
			$("#" + this.containerId).html(tpl_replace(HTML, renderObj));
		},
		bindEvent: function() {
			var _this = this;
			var startX;
			console.log(this.containerId);
			$("#" + this.containerId).on("touchstart mousedown", touchHandler).bind("touchmove mousemove", touchHandler).bind("touchend mouseup", touchHandler);
			/*
			var ele = document.getElementById(this.containderId);
			ele.addEventListener('touchstart', touchHandler, false);
			ele.addEventListener('touchmove', touchHandler, false);
			ele.addEventListener('touchend', touchHandler, false);*/

			function resetLeft(dis) {
				var ret = dis;
				ret = ret < _this.minLeft ? _this.minLeft : ret;
				ret = ret > _this.maxLeft ? _this.maxLeft : ret;
				return ret;
			}
			var dragging = false;

			function touchStart(event) {
				console.log("touch start....");
				event.preventDefault();
				startX = event.type.startsWith("touch") ? event.touches[0].clientX : event.clientX;
				dragging = true;
				// console.log("startX:" + startX);
				// console.log(" event.touches[0].clientX:" + event.touches[0].clientX);
				// console.log("event.clientX:" + event.clientX);
			}

			function touchMove(event) {
				if (dragging) {
				// console.log("touch move.......");
					event.preventDefault();
					var clientX  = event.type.startsWith("touch") ? event.touches[0].clientX : event.clientX;
					var eventDis = clientX - startX;
					_this.setPosition(resetLeft(_this.transFormX + eventDis * 0.8));
				}
			}

			function touchEnd(event) {
				// console.log("touch end....");
				event.preventDefault();
				var clientX  = event.type.startsWith("touch") ? event.changedTouches[0].clientX : event.clientX;
				var eventDis = clientX - startX;
				_this.transFormX = resetLeft(_this.transFormX + eventDis * 0.8);
				dragging = false;
			}

			function touchHandler(event) {
				var event = event.originalEvent || window.event
				switch (event.type) {
					case "touchstart":
						touchStart(event);
						break;
					case "mousedown":
						touchStart(event);
						break;
					case "touchmove":
						touchMove(event);
						break;
					case "mousemove":
						touchMove(event);
						break;
					case "touchend": 
						touchEnd(event);
						break;
					case "mouseup":
						touchEnd(event);
						break;
				
				}
			}
		}
	}
	return AgeComponent;
})();