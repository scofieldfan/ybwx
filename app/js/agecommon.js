/*
 * @Author: fanzhang
 * @Date:   2016-08-04 13:59:59
 * @Last Modified by:   fanzhang
 * @Last Modified time: 2016-08-12 19:50:21
 */

'use strict';
window.AgeComponent = (function() {

	var MIN_AGE = 0;       //最小的年龄
	var MAX_AGE = 120;    //最大的年龄
	var AGE_DURATION = 5; //间隔5年 中间插入一个大一点的刻度
	var START_AGE = 30;//初始的年龄
	var YEAR_DIS = 18; //1年间隔18个像素。调整css会修改。
	var WIDTH = 300; //container的宽度
	var SIDE_AGE = 20;
	var CONTAINER_ID = "ageMainContainer";
	
	var HTML = [
		'',
		'<div class="age-container" id="{sliderContainerId}">',
		'		<div id="{bgContainerId}" style="left:0px;" class="bg-container">{htmlContent}</div>',
		'		<div id="{needleId}" class="needle"  style="left:{offset}px;" ><a></a></div>',
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
		this.ageDuration = config.ageDuration || AGE_DURATION; 
		this.startAge = config.startAge || START_AGE;
		this.yearDis = config.yearDis || YEAR_DIS;
		this.containerId = config.containerId || CONTAINER_ID;
		this.changeCallback = config.changeCallback;
		this.beyondLeftCallback = config.beyondLeftCallback;
		this.beyondRightCallback = config.beyondRightCallback;
		this.offset = WIDTH/2;//指针的偏移，默认在左边
		this.age = this.startAge;//当前的年龄
		this.maxLeft = 0;//最左边只能到指针的1半
		this.minLeft = - this.yearDis * (this.maxAge - this.minAge); //指针能移动的最右边，为负值
		this.transFormX = -(this.startAge-this.minAge) * this.yearDis;//相对与最左边移动的位置
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
			this.setAge();
		},
		setAge: function(age){
			this.transFormX = -(this.age-this.minAge) * this.yearDis;
			this.setPosition(this.transFormX);
		},
		setPosition: function(transFormDis) { //移动背景的位置
			var age = this.minAge-Math.round( (transFormDis / this.yearDis)) ;
			if(this.changeCallback){
				this.changeCallback(age);
			}
			this.age = age;
			$("#" + this.containerId).find("#" + this.idObj.ageId).html(age);
			$("#" + this.containerId).find("#"+this.idObj.bgContainerId).css("transform",'translateX(' + (this.offset - (age-this.minAge+SIDE_AGE) * this.yearDis) + 'px)');
		},
		createDom: function() {
			var html = [];
			for (var i = this.minAge - SIDE_AGE; i <= this.maxAge+SIDE_AGE; i++) {
				if (i % this.ageDuration !== 0) {
					html.push('<a style="width:'+this.yearDis+'px"></a>');
				} else {
					if( i >= this.minAge && i <= this.maxAge){
						html.push('<a class="high"  style="width:'+this.yearDis+'px"><span>' + i + '</span></a>'); //比较粗的指针
					}else{
						html.push('<a class="high"  style="width:'+this.yearDis+'px"><span></span></a>'); //比较粗的指针
					}
				}
			}
			var renderObj = $.extend(this.idObj, {
				htmlContent: html.join(""),
				age: this.age,
				offset: this.offset
			});
			$("#" + this.containerId).html(tpl_replace(HTML, renderObj));
		},
		bindEvent: function() {
			var _this = this;
			var startX;
			$("#" + this.containerId).on("touchstart mousedown", touchStart).bind("touchmove mousemove", touchMove).bind("touchend mouseup", touchEnd);
			function resetLeft(dis) {
				var ret = dis;
				if(ret<_this.minLeft && typeof  _this.beyondLeftCallback === "function"){
					_this.beyondLeftCallback();
				}
				if(ret>_this.maxLeft && typeof _this.beyondRightCallback === "function" ){
					_this.beyondRightCallback();
				}
				ret = ret < _this.minLeft ? _this.minLeft : ret;
				ret = ret > _this.maxLeft ? _this.maxLeft : ret;
				return ret;
			}
			var dragging = false;

			function touchStart(event) {
				var event = event.originalEvent || window.event
				event.preventDefault();
				startX =  event.touches ? event.touches[0].clientX : event.clientX;
				dragging = true;
				
			}

			function touchMove(event) {
				var event = event.originalEvent || window.event
				if (dragging) {
					event.preventDefault();
					var clientX  =event.touches ? event.touches[0].clientX : event.clientX;
					var eventDis = clientX - startX;
					_this.setPosition(resetLeft(_this.transFormX + eventDis * 0.8));
				}
			}

			function touchEnd(event) {
				var event = event.originalEvent || window.event
				event.preventDefault();
				var clientX  = event.touches ? event.changedTouches[0].clientX : event.clientX;
				var eventDis = clientX - startX;
				_this.transFormX = resetLeft(_this.transFormX + eventDis * 0.8);
				_this.setPosition(_this.transFormX);
				dragging = false;
			}
	
		}
	}
	return AgeComponent;
})();