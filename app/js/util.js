var util = {
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
	getOpenId: function(code) {
		if (!sessionStorage.getItem("openId")) {
			return $.when($.ajax({
				type: 'GET',
				url: util.api["openid"],
				data: {
					code: code
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
	getSign: function() {
		var shareUrl = "http://web.youbaowuxian.com#/index";
		return $.when($.ajax({
			type: 'GET',
			url: util.api["signature"],
			data: {
				"url": location.href.split('#')[0]
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
				var shareTitle = "诺贝保险管家！";
				var shareLink = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx526ab87a436ee1c3&redirect_uri=' + encodeURIComponent(shareUrl) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
				var shareDesc = "诺贝保险管家，为您定制保险！";
				var shareImg = "http://web.youbaowuxian.com/wx_share/img/share.jpg";

				wx.onMenuShareTimeline({
					title: shareTitle,
					link: shareLink,
					imgUrl: shareImg,
					success: function() {
						// alert(shareLink);
						//console.log(shareLink);
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
				// alert(res);
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			});
		})
	},
	share: function(shareObj, isNotEncode) {
		var shareObj = shareObj || {};
		return $.when($.ajax({
			type: 'GET',
			url: util.api["signature"],
			data: {
				"url": location.href.split('#')[0]
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
				var shareUrl = "http://web.youbaowuxian.com/index.html#index";
				var shareTitle = shareObj.shareTitle || "诺贝保险管家！";
				var url = shareObj.shareUrl || shareUrl;
				var shareDesc = shareObj.shareDesc || "诺贝保险管家，为您定制保险！";
				var shareImg = shareObj.shareImg || "http://web.youbaowuxian.com/img/icon.jpg";

				var shareLink = isNotEncode ? url : 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx526ab87a436ee1c3&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
				wx.onMenuShareTimeline({
					title: shareTitle,
					link: shareLink,
					imgUrl: shareImg,
					success: function() {
						// alert(shareLink);
						//console.log(shareLink);
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
				"url": location.href.split('#')[0]
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
				"order_no": order_no
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
		5: "已购买"

	},
	/*
			保险产品状态：
			UNKNOWN(0, "保险产品状态未知"),
			CREATED(1, "创建成功"),
			SELLING(2, "出售"),
			TEST(3, "测试"),
			HOT(4, "热卖"),
			DISCOUNT(5, "特惠");

	*/
	getTaoCanStatus: function(status) {
		return util.taocan_status[status];
	},
	redirectWeChatUrl: function(redirectUrl) {
		if (typeof redirectUrl === "string" && redirectUrl.indexOf("http") == 0) {
			var WE_CHAT_URL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx526ab87a436ee1c3&redirect_uri=" + encodeURIComponent(redirectUrl) + "&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
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
	modifyRelationShip: [ {
			id: 2,
			name: '父亲'
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

	]
}