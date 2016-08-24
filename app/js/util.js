var util = {
	domain:'http://wechat.nuobei.cn/',
	appId:'wxe797ac4e18b99078',
	shareScope:'snsapi_userinfo',
	api: {
		"openid": "/ybwx-web/wechat/open_id",
		"signature": "/ybwx-web/wechat/js_signature"
	},
	getParameterByName: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	showToastJQ: function(msg) {
		$("#toast").find(".weui_toast_content").html(msg);
		$("#toast").show();
		setTimeout(function() {
			$("#toast").fadeOut();
		}, 2000);
	},
	genParameters: function(obj) {
		var str = [];
		for (var key in obj) {
			str.push(key + "=" + obj[key]);
		}
		return str.join("&");
	},
	hasScrollbar: function() {
		// The Modern solution
		if (typeof window.innerWidth === 'number')
			return window.innerWidth > document.documentElement.clientWidth

		// rootElem for quirksmode
		var rootElem = document.documentElement || document.body

		// Check overflow style property on body for fauxscrollbars
		var overflowStyle

		if (typeof rootElem.currentStyle !== 'undefined')
			overflowStyle = rootElem.currentStyle.overflow

		overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow

		// Also need to check the Y axis overflow
		var overflowYStyle

		if (typeof rootElem.currentStyle !== 'undefined')
			overflowYStyle = rootElem.currentStyle.overflowY

		overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY

		var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight
		var overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle)
		var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll'

		return (contentOverflows && overflowShown) || (alwaysShowScroll)
	},
	processSpecialMoney: function(moneyStr) {
		if (typeof moneyStr !== 'string') {
			moneyStr = '' + moneyStr;
		}
		var tail = '';
		var ret = moneyStr;
		var isTail = false;
		var isW = false;
		if (moneyStr && moneyStr.charAt(moneyStr.length - 1) === "d") {
			ret = parseInt(moneyStr.substring(0, moneyStr.length - 1));
			isTail = true;
		}
		if (ret >= 1000) {
			ret = ret / 10000;
			tail = '万'
		} else {
			ret = ret;
			tail = '元'
		}
		if (isTail) {
			tail += '/天';
		}
		return ret + tail;

	},
	showToast: function($rootScope, msg) {
		$rootScope.server_reason = msg;
		$("#toast").show();
		setTimeout(function() {
			$("#toast").fadeOut();
		}, 2000);
	},
	preventDefault: function(e) {
		e = e || window.event;
		e.preventDefault && e.preventDefault();
		e.returnValue = false;
	},
	enableScroll :function(){
			$(document).off('mousewheel', util.preventDefault);
			$(document).off('touchmove', util.preventDefault);
	},
	disableScroll:function(){
		$(document).on('mousewheel', util.preventDefault);
		$(document).on('touchmove', util.preventDefault);
	},
	getOpenId: function(code) {
		if (!sessionStorage.getItem("openId")) {
			return $.when($.ajax({
				type: 'GET',
				url: util.api["openid"],
				data: {
					code: code,
					type:2
				},
				dataType: "json"
			})).done(function(res) {
				if (res && res.data && res.data["openid"]) {
					sessionStorage.setItem("openId", res.data["openid"]);
				} else {
					console.error("invalid code......");
				}
			});
		}
		return $.when();
	},

	share: function(shareObj, isNotEncode) {
		var shareObj = shareObj || {};
		return $.when($.ajax({
			type: 'GET',
			url: util.api["signature"],
			data: {
				url: location.href.split('#')[0],
				type:2
			},
			dataType: "json"
		})).done(function(res) {
			//依赖于微信的JS
			console.log(res);
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: res.data["app_id"], // 必填，公众号的唯一标识
				timestamp: res.data["timestamp"], // 必填，生成签名的时间戳
				nonceStr: res.data["noncestr"], // 必填，生成签名的随机串
				signature: res.data["signature"], // 必填，签名，见附录1
				jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
				// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function() {
				console.log("wexin success....")
				// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				var shareUrl = util.domain+"index.html#index";
				var shareTitle = shareObj.shareTitle || "诺贝保险管家！";
				var url = shareObj.shareUrl || shareUrl;
				var shareDesc = shareObj.shareDesc || "诺贝保险管家，为您定制保险！";
				var shareImg = shareObj.shareImg || util.domain+"img/icon.jpg";

				var shareLink = isNotEncode ? url : 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+util.appId+'&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope='+util.shareScope+'&state=123#wechat_redirect';
				wx.onMenuShareTimeline({
					title: shareTitle,
					link: shareLink,
					imgUrl: shareImg,
					success: function() {
						// alert(shareLink);
						//console.log(shareLink);
						if(shareObj.successCallback){
							shareObj.successCallback();
						}
					},
					cancel: function() {}
				});
				wx.onMenuShareAppMessage({
					title: shareTitle,
					desc: shareDesc,
					link: shareLink,
					imgUrl: shareImg,
					dataUrl: '',
					success: function() {
						//alert(shareLink);
						//window.location.href = shareLink;
					},
					cancel: function() {}
				});
			});
			wx.error(function(res) {
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				_hmt.push(['_trackEvent', 'wechat_error', res]);
			});
		})
	},
	uploadImgConfig: function(successCallback) {


		return $.when($.ajax({
			type: 'GET',
			url: util.api["signature"],
			data: {
				"url": location.href.split('#')[0],
				 type:2
			},
			dataType: "json"
		})).done(function(res) {
			//依赖于微信的JS
			console.log(res);
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: res.data["app_id"], // 必填，公众号的唯一标识
				timestamp: res.data["timestamp"], // 必填，生成签名的时间戳
				nonceStr: res.data["noncestr"], // 必填，生成签名的随机串
				signature: res.data["signature"], // 必填，签名，见附录1
				jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
				// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function() {
				console.log("wexin success....")
				successCallback();
			});

		})
	},
	sendMail: function($http, $rootScope, url, openId, email, order_no) {
		$http({
			method: 'POST',
			headers: {
				"Content-Type": "application/json;charset:UTF-8"
			},
			url: url,
			data: {
				"open_id": openId,
				"email": email,
				"order_no": order_no,
				wechat_type:1
			}
		}).then(function(res) {
			console.log(res);
			if (res.data && res.data.description) {
				util.showToast($rootScope, res.data.description);
			} else if (res.data.code === 0) {
				util.showToast($rootScope, "邮件发送成功，请注意查收");
			}
		}, function(res) {
			console.log(res);
			util.showToast($rootScope, "服务器错误");
		});
	},
	coverage_types: {
		1: "保终身",
		2: "年",
		3: "岁",
		4: "月",
		5: "天"
	},
	getCoverageType: function(type) {
		return util.coverage_types[type];
	},
	addDays: function addDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	},
	minusDays: function addDays(date, days) {
		var result = new Date(date);
		result.setDate(result.getDate() - days);
		return result;
	},
	calculate_age: function(birth_month, birth_day, birth_year) {
		today_date = new Date();
		today_year = today_date.getFullYear();
		today_month = today_date.getMonth();
		today_day = today_date.getDate();
		age = today_year - birth_year;

		if (today_month < (birth_month - 1)) {
			age--;
		}
		if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
			age--;
		}
		return age;
	},
	taocan_status: {
		1: "",
		2: "未开售",
		3: "已购买",
		4: "已购买",
		5: "已购买",
		6: "不可投",
		7: "不可投",
		8: "不可投",
		9: "不可投"
	},
	taocan_reason: {
		0: "套餐不可购买",
		3: "保险产品份数超过限制",
		4: "保险套餐份数超过限制",
		5: "保额超过限制",
		6: "投保人年龄不符合条件",
		7: "被保人年龄不符合条件",
		8: "被保人性别不符合条件",
		9: "被保人关系在此产品不能投保"
	},
	/*
			保险产品套餐状态：
			(0, "套餐不可购买")
			(1, "套餐可购买")
			(2, "套餐未开售")
			(3, "保险产品份数超过限制")
			(4, "保险套餐份数超过限制")
			(5, "保额超过限制")
			(6, "投保人年龄超过限制")
			(7, "被保人年龄超过限制")
			(8, "被保人性别超过限制")

	*/
	getTaoCanStatus: function(status) {
		return util.taocan_status[status];
	},
	redirectWeChatUrl: function(redirectUrl) {
		if (typeof redirectUrl === "string" && redirectUrl.indexOf("http") == 0) {
			var WE_CHAT_URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+util.appId+'&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope='+util.shareScope+'&state=123#wechat_redirect';
			window.location.href = WE_CHAT_URL;
		}
	},
	checkCodeAndOpenId: function(angularCode, currentUrl, callback) {
		var code = util.getParameterByName("code") || angularCode;
		if (!sessionStorage.getItem("openId") && !code) {
			//如果没有openId,也没有code，那么就跳转一次
			util.redirectWeChatUrl(currentUrl);
		} else {
			util.getOpenId(code).then(function() {
				var openId = sessionStorage.getItem("openId");
				if (!openId) {
					//如果用当前的code如法获得openId，那么就重新跳转获得一次openId
					util.redirectWeChatUrl(currentUrl);
				} else {
					if (typeof callback === "function") {
						callback();
					}
				}
			});
		}

	},
	whiteOpenIds: [{
		openid: "omP9dwb6u-lamgwOhFqFIcU3QLPk",
		name: "巴信军"
	}, {
		openid: "omP9dwbQiEkPbFE0K6NtVa4d5bF0",
		name: "Fan"
	}, {
		openid: "omP9dwThw9op485Y-6NMp6HywJ0M",
		name: "郭渊敏"
	}, {
		openid: "omP9dwSdKKzWA4D9j1I1Lr1EbHMg",
		name: "许文科"
	}, {
		openid: "omP9dwSHJtzwyRFBCBc3z-jpxwj8",
		name: "岳文甲"
	}],
	relationShip: [{
			id: 1,
			name: '本人'
		}, {
			id: 2,
			name: '父母'
		}, {
			id: 3,
			name: '子女'
		}, {
			id: 4,
			name: '配偶'
		}, {
			id: 5,
			name: '同事'
		}, {
			id: 6,
			name: '其他'
		}

	],
	//不含本人信息
	modifyRelationShip: [{
			id: 2,
			name: '父母'
		}, {
			id: 3,
			name: '子女'
		}, {
			id: 4,
			name: '配偶'
		}, {
			id: 5,
			name: '同事'
		}, {
			id: 6,
			name: '其他'
		}

	],
	banks:[
		{id:0 ,  name: "请选择银行"},
		{id:1	,name:'工商银行'},
		{id:2	,name:'建设银行'},
		{id:3	,name:'储蓄银行'},
		{id:4	,name:'农业银行'},
		{id:5	,name:'民生银行'},
		{id:6	,name:'招商银行'},
		{id:7	,name:'兴业银行'},
		{id:8	,name:'中国银行'},
		{id:9	,name:'中信银行'},
		{id:10	,name:'交通银行'},
		{id:11	,name:'平安银行'},
		{id:12	,name:'光大银行'}
	]
}
