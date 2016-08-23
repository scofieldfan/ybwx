'use strict';

/* Controllers */


var wxShareControllers = angular.module('wxShareControllers', []);
var shareUrl = 'http://wechat.nuobei.cn/wx_share.html';
var api = {
	"saveBd": "/ybwx-web/api/use_coupon",
	'addCoupon': '/ybwx-web/api/add_coupon',
	'getCoupons': '/ybwx-web/api/get_coupons',
	'addFreeBd': '/ybwx-web/api/use_coupon',
	'send_bd': '/ybwx-web/api/send_policy',
	'ping_coupon': '/ybwx-web/api/ping_coupon',
	'exchange': '/ybwx-web/api/exchange_coupon',
	'prepare_insure': '/ybwx-web/api/insurance/prepare',
	'purchase': '/ybwx-web/api/insurance/purchase',
	'share_callback': '/ybwx-web/api/insurance/share',
	'is_share': '/ybwx-web/api/insurance/share/status'
}



function getHttpPromise($http, $rootScope, method, url, data, callback, isCoverDefault) {

	data["open_id"] = '--';
	data['wechat_type'] = 2;
	return $http({
		method: method,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		url: url,
		data: data
	}).then(function(res) {

		if (isCoverDefault) {
			callback(res);
		} else {
			if ((res && res.data && res.data.data) || (res && res.data && res.data.code === 0)) {
				callback(res);
			} else {
				util.showToast($rootScope, res.data.description);
			}
		}

	}, function(res) {
		console.log(res);
		_hmt.push(['_trackEvent', 'http_error', "api:" + url]);
		util.showToast($rootScope, "服务器错误");
	});
}



function shareTip() {
	$("#share").show();
}

function submitBd($scope, $http, $location, $filter) {
	var insuranceDate = $filter('date')($scope.user.insurance_date, "yyyyMMdd");
	var postData = {
		coupon_no: $scope.coupon_no,
		username: $scope.user.username,
		social_id: $scope.user.social_id,
		mobile: $scope.user.mobile,
		insure_date: insuranceDate
	};
	postData["flight_no"] = $scope.user.flight_no;
	postData['wechat_type'] = 2;
	return $http({
		method: 'POST',
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		url: api['saveBd'],
		data: postData
	})

}
wxShareControllers.controller('sportsCtrl', ['$scope', '$filter', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $filter, $routeParams, $http, $location, $rootScope) {


		var qd = util.getParameterByName("qd") || $routeParams.qd || 'default';
		_hmt.push(['_trackPageview', '/wx_share_jixian']);
		_hmt.push(['_setCustomVar', 1, 'jixian_qudao', qd, 1]);
		var currentUrl = util.domain + "wx_share.html#/jixian";
		$scope.init = function() {

			util.checkCodeAndOpenId($routeParams.code, currentUrl, function() {
				$("#loadingToastCommon").hide();
				// 分享的id
				var rec_id = window.NBCONF.USER['unionid'] || '';

				util.share({
					shareUrl: util.domain + "wx_share.html#/jixian?rec_id=" + rec_id,
					shareImg: util.domain + "wx_share/img/share_sport.png",
					shareTitle: "免费领取10万元极限运动险！要酷，更要安全！",
					shareDesc: "每月均可领取1份，每邀请1位好友，即可再免费领取1份。约上朋友一起突破极限吧！"
				});

				$scope.jixianPromise = getHttpPromise($http, $rootScope, 'POST', api['ping_coupon'], {
					"coupon_id": "4",
					"time": new Date().getTime()
				}, function(res) {
					if (res.data && res.data.description) {
						util.showToast($rootScope, res.data.description);
					} else if (res.data.code === 0) {
						$scope.data = res.data.data;
						if (res.data.data.recommend_times > 0) {
							$("#coupons_container").show();
						}
					}
				});
			});
		}
		$scope.init();
		$scope.sportsAddCoupon = function() {
			_hmt.push(['_trackEvent', 'wx_share_jixian', 'wx_share_jixian_left_button']);
			var recId = util.getParameterByName('rec_id') || $routeParams.rec_id;

			$scope.addCoupon = getHttpPromise($http, $rootScope, 'POST', api['addCoupon'], {
				"r_open_id": recId,
				"coupon_id": "4"
			}, function(res) {
				console.log(res);
				if (res.data && res.data.description) {
					$("#pop").show();
					$("#popup").click(function() {
						$("#pop").hide();
					});
					$("#popup-btn").click(function() {
						$("#pop").hide();
					});
					// util.showToast($rootScope, res.data.description);
				}
				// util.showToast($rootScope,res.data.description);
				if (res.data.code == 0) {
					$location.path('/success_coupon/').search({
						count: (res.data.data["coupon_counts"] + 1)
					});
				}
				console.log(res);
			});

		}
		$scope.showShareTip = function() {
			_hmt.push(['_trackEvent', 'wx_share_jixian', 'wx_share_jixian_right_button']);
			shareTip();
		}

	}
]);
wxShareControllers.controller('shenheCtrl', ['$scope', '$filter', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $filter, $routeParams, $http, $location, $rootScope) {
		var currentUrl = util.domain + "wx_share.html#/shenhe";
		util.checkCodeAndOpenId($routeParams.code, currentUrl, function() {

		});
		$scope.buy = function() {
			$location.path("/moneybd").search({
				plan: 72,
				money: 50
			});
		}
	}
]);

wxShareControllers.controller('specialCtrl', ['$scope', '$filter', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $filter, $routeParams, $http, $location, $rootScope) {

		var currentUrl = util.domain + "wx_share.html#/special";
		var qd = util.getParameterByName("qd") || $routeParams.qd || 'default';
		_hmt.push(['_trackPageview', '/1year_hangkong_yiwai']);
		_hmt.push(['_setCustomVar', 1, '1year_hangkong_qudao', qd, 1]);
		//没有code跳转，如果没有获得openId也跳转
		$scope.init = function() {
			$("#loadingToastCommon").show();
			util.checkCodeAndOpenId($routeParams.code, currentUrl, function() {
				$("#loadingToastCommon").hide();
				$scope.prePromise = getHttpPromise($http, $rootScope, 'POST', api['is_share'], {
					"insurance_plan_id": 72
				}, function(res) {
					$scope.isShare = res.data.data.status;
				});
			});
			util.share({
				shareUrl: util.domain + "wx_share.html#/special",
				shareImg: "/wx_share/img/share_s.png",
				shareTitle: "还在买捆绑的30元一次的航意险？在这里500万保一年无限次仅需40元！",
				shareDesc: "仅需1杯咖啡的花费即可享受1年500万航空意外的保障！",
				successCallback: function() {
					$scope.prePromise = getHttpPromise($http, $rootScope, 'POST', api['share_callback'], {
						"insurance_plan_id": 72
					}, function(res) {
						//$("#special_share").html("点击即可优惠购买");
						$scope.isShare = true;
						util.showToast($rootScope, "分享成功，恭喜您获得优惠购买的机会！");
					});
				}
			});


		};
		$scope.original = function() {
			_hmt.push(['_trackEvent', 'special_share', "goMoneybd_50"]);
			$location.path('/moneybd').search({
				plan: 72,
				money: 50
			});
		}

		$scope.discount = function() {
			if ($scope.isShare) {
				_hmt.push(['_trackEvent', 'special_share', "goMoneybd_40"]);
				$location.path('/moneybd').search({
					plan: 72,
					money: 40
				});
			} else {
				$("#share_ctrl").show();
				$("body").on("click", "#share_ctrl", function() {
					$("#share_ctrl").hide();
				});
				$("body").on("click", "#zhen", function() {
					$("#share_ctrl").hide();
				})
			}

		}

	}
]);
//付费投保
wxShareControllers.controller('wxMoneyBdCtrl', ['$scope', '$filter', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $filter, $routeParams, $http, $location, $rootScope) {
		_hmt.push(['_trackPageview', "/wx_share_toubao"]);

		$scope.money = $routeParams.money;

		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		$scope.user = {};
		$scope.user.insurance_date = tomorrow;

		$scope.user.know_contract = true;

		$scope.prePromise = getHttpPromise($http, $rootScope, 'POST', api['prepare_insure'], {
			"plans": [$routeParams.plan]
		}, function(res) {
			var minDate = new Date();
			minDate.setDate(minDate.getDate() + res.data.data.min_effective_days);
			$scope.minDate = minDate;
			var maxDate = new Date();
			maxDate.setDate(maxDate.getDate() + res.data.data.max_effective_days);
			$scope.maxDate = maxDate;
			$scope.user.username = res.data.data.insured.username;
			$scope.user.mobile = parseInt(res.data.data.insured.mobile);
			$scope.user.social_id = res.data.data.insured.social_id;
			sessionStorage.setItem("sell_plan", JSON.stringify(res.data.data.plans)); //存储需要支付的订单
		});


		$scope.submit = function() {
			_hmt.push(['_trackEvent', 'wx_share_toubao', 'wx_share_toubao_subtn']);
			var socialId = $scope.user.social_id;
			var age = 0;
			if (socialId && socialId.length === 18) {
				var birthday = socialId.substring(6, 14);
				var birthMonth = birthday.substring(4, 6);
				var birthDay = birthday.substring(6, 8);
				var birthYear = birthday.substring(0, 4);
				age = util.calculate_age(birthMonth, birthDay, birthYear);
			}

			if (!$scope.registration.$invalid && age >= 18) {

				//$("#loadingToast").show();

				var insuranceDate = $filter('date')($scope.user.insurance_date, "yyyyMMdd");
				var plans = {};
				plans[$routeParams.plan] = $routeParams.money;

				$scope.insurePromise = getHttpPromise($http, $rootScope, 'POST', api['purchase'], {
					plans: plans,
					username: $scope.user.username,
					social_id: $scope.user.social_id,
					mobile: $scope.user.mobile,
					effective_date: insuranceDate

				}, function(res) {

					$("#loadingToast").hide();
					//存储用户信息
					if (res.data.code === 0) {
						var orderId = res.data.data.order_no; //支付
						var payRequest = {
							"insurance_name": res.data.data.insurance_name,
							"insurance_plan_name": res.data.data.insurance_plan_name,
							"order_amount": res.data.data.order_amount,
							"order_id": res.data.data.pay_order_id,
							"order_no": res.data.data.pay_order_no

						}

						// TODO: openid和白名单匹配的时候,支付0.1元

						var filterResult = util.whiteOpenIds.filter(function(item) {
							return item.openid === openId
						});
						if (filterResult && filterResult.length > 0) {
							payRequest["order_amount"] = 0.1;
						}


						var paramters = util.genParameters(payRequest);
						//console.log(paramters);
						window.location.href = "/index.html#pay_select?" + paramters;
						//$location.path("/pay_select").search(payRequest);
					}
					if (res && res.data && res.data.description) {
						//$("#loadingToast").hide();
						util.showToast($rootScope, res.data.description);
					}
				});


			} else { //表单错误
				if ($scope.registration.username.$invalid) {
					util.showToast($rootScope, "姓名填写有误，请修改");
				}
				if ($scope.registration.social_id.$invalid) {
					util.showToast($rootScope, "身份证填写有误，请修改");
				}
				if (age < 18) {
					util.showToast($rootScope, "投保人年龄必须大于18岁");
				}
				if ($scope.registration.mobile.$invalid) {
					util.showToast($rootScope, "手机号码填写有误，请修改");
				}
				if ($scope.registration.insurance_date.$invalid) {
					util.showToast($rootScope, "保险生效时间不正确");
				}
				if ($scope.registration.flight_no && $scope.registration.flight_no.$invalid) {
					util.showToast($rootScope, "航班号必须填写");
				}
			}
		}


	}
]);

//免费投保
wxShareControllers.controller('wxShareBdCtrl', ['$scope', '$filter', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $filter, $routeParams, $http, $location, $rootScope) {
		_hmt.push(['_trackPageview', "/wx_share_toubao"]);
		$scope.coupon_id = $routeParams.coupon_id;
		$scope.coupon_no = $routeParams.coupon_no;
		var testDate = new Date();
		testDate.setDate(testDate.getDate() + 1);
		$scope.minDate = testDate;

		console.log($scope.minDate);
		var tmp = new Date(Number($routeParams.expiry_date));
		tmp.setDate(tmp.getDate() - 1);
		$scope.maxDate = tmp;
		$scope.user = {};
		$scope.user.insurance_date = testDate;
		console.log($scope.maxDate);
		var userinfo = JSON.parse(localStorage.getItem('userinfo'));
		if (userinfo) {
			$scope.user = {
				username: userinfo.username,
				social_id: userinfo.social_id,
				mobile: userinfo.mobile
			}
		} else {
			$scope.user = {};
		}
		$scope.user.know_contract = true;
		//saveBd($http,"张三","411202198509190511","18910873024");
		$scope.server_reason = "";
		// toggle

		function addDays(date, days) {
			var result;
			if (date) {
				result = new Date(date);
				result.setDate(result.getDate() + days);
			} else {
				result = '';
			}

			return result;
		}
		$scope.genInEffectiveDate = function() {
			//计算失效日期

			var testDate = new Date();
			$scope.user.inEnd_date = addDays($scope.user.insurance_date, 3);

		};

		$scope.submit = function() {
			_hmt.push(['_trackEvent', 'wx_share_toubao', 'wx_share_toubao_subtn']);

			console.log($scope.registration);
			console.log("invalid:" + $scope.registration.$invalid);
			if (!$scope.registration.$invalid) {
				$("#loadingToast").show();
				//util.showToast($rootScope,"正在提交,请稍后.....");

				submitBd($scope, $http, $location, $filter).then(function(res) {
					console.log(res);
					$("#loadingToast").hide();

					localStorage.setItem('userinfo',
						JSON.stringify({
							username: $scope.user.username,
							social_id: $scope.user.social_id,
							mobile: $scope.user.mobile,

						}));

					if (res.data.code === 0) {
						var orderId = res.data.data.order_no;
						console.log(res);
						console.log("orderId:" + orderId);
						$location.path('/success/').search({
							"order_no": orderId
						});;
					}
					if (res && res.data && res.data.description) {
						util.showToast($rootScope, res.data.description);
					}
					console.log(res.data.code);
				}, function(res) {
					//$("#loading").hide();
					$("#loadingToast").hide();
					$scope.server_reason = "服务器出错";
					console.log(res);
				});

			} else {
				if ($scope.registration.username.$invalid) {
					util.showToast($rootScope, "姓名填写有误，请修改");
				}
				if ($scope.registration.social_id.$invalid) {
					util.showToast($rootScope, "身份证填写有误，请修改");
				}
				if ($scope.registration.mobile.$invalid) {
					util.showToast($rootScope, "手机号码填写有误，请修改");
				}
				if ($scope.registration.insurance_date.$invalid) {
					util.showToast($rootScope, "保险生效时间不正确");
				}
				if ($scope.registration.flight_no.$invalid) {
					util.showToast($rootScope, "航班号必须填写");
				}
			}
		}

	}
]);



wxShareControllers.controller('wxShareSuccessCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', "/wx_share_success_toubao"]);
		$scope.orderId = $location.search().order_no;
		$scope.send_bd = function() {
			_hmt.push(['_trackEvent', 'wx_share_success_toubao', 'wx_share_success_toubao_send_bd']);
			console.log("$scope.sendForm.email.$invalid:" + $scope.sendForm.email.$invalid);
			if (!$scope.sendForm.email.$invalid) {
				util.sendMail($http, $rootScope, api['send_bd'], $scope.user.email, $location.search().order_no);

			} else {
				util.showToast($rootScope, "请填写正确的邮箱!");
			}

		}
		$scope.goList = function() {
			_hmt.push(['_trackEvent', 'wx_share_success_toubao', 'wx_share_success_toubao_viewbaodan']);
			window.location.href = "/#bd_list"
		}
		$scope.showShareTip = function() {
			_hmt.push(['_trackEvent', 'wx_share_success_toubao', 'wx_share_success_toubao_sharetip']);
			shareTip();
		}
	}
]);


wxShareControllers.controller('wxSharesuccessCouponCtrl', ['$scope', '$routeParams', '$location',
	function($scope, $routeParams, $location) {
		//sessionStorage
		_hmt.push(['_trackPageview', '/wx_share_success_getcoupon']);
		$scope.count = $routeParams.count;
		$scope.goCouponList = function() {
			$location.path('/couponlist');
		}
		$scope.showShareTip = function() {
			_hmt.push(['_trackEvent', 'wx_share_success_getcoupon', 'wx_share_success_getcoupon_tailbutton']);
			shareTip();
		}
	}
]);


wxShareControllers.controller('wxShareIndexCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $routeParams, $http, $location, $rootScope) {

		var qd = util.getParameterByName("qd") || $routeParams.qd || 'default';

		$scope.qd = qd;

		_hmt.push(['_trackPageview', '/wx_share_index']);
		_hmt.push(['_setCustomVar', 1, 'hangkong_qudao', qd, 1]);
		//_hmt.push(['_trackPageview', '/wx_share_index'+"_qd_"+qd]);
		var currentUrl = util.domain + "wx_share.html#/index"
		$scope.init = function() {
			$scope.data = {
				remain_times: 1,
				recommend_times: 0
			}

			util.checkCodeAndOpenId($routeParams.code, currentUrl, function() {
				$("#loadingToastCommon").hide();

				var rec_id = window.NBCONF.USER['unionid'] || '';

				util.share({
					shareUrl: util.domain + "wx_share.html#/index?rec_id=" + rec_id,
					shareImg: "/wx_share/img/share61.jpg",
					shareTitle: "送你一份500万航空意外险，买机票立省30元！",
					shareDesc: "集齐3份航空意外险保险券，即可免费兑换一份航班延误险保险券！"

				});
				$scope.prePromise = getHttpPromise($http, $rootScope, 'POST', api['ping_coupon'], {
					"coupon_id": "2"
				}, function(res) {
					if (res.data && res.data.description) {
						//util.showToast($rootScope, res.data.description);
					} else if (res.data.code === 0) {
						$scope.data = res.data.data;
						//console.log($scope.data);
						if (res.data.data.recommend_times > 0) {
							$("#coupons_container").show();
						}
					}
				});
			});


		}
		$scope.init();
		$scope.addCoupon = function() {
			_hmt.push(['_trackEvent', 'wx_share_index', 'wx_share_index_left_button']);
			var recId = util.getParameterByName('rec_id') || $routeParams.rec_id;

			$scope.addPromise = getHttpPromise($http, $rootScope, 'POST', api['addCoupon'], {
				"r_open_id": recId,
				"coupon_id": "2"
			}, function(res) {
				console.log("data...");
				if (res.data && res.data.description) {
					$("#pop").show();
					$("#popup").click(function() {
						$("#pop").hide();
					});
					$("#popup-btn").click(function() {
						$("#pop").hide();
					});
				}
				if (res.data.code == 0) {
					$location.path('/success_coupon').search({
						count: (res.data.data["coupon_counts"] + 1)
					});
				}
			},true);

		}
		$scope.exchange = function() {
			_hmt.push(['_trackEvent', 'wx_share_index', 'wx_share_index_exchange_button']);


			$scope.exchangePromise = getHttpPromise($http, $rootScope, 'POST', api['exchange'], {
			}, function(res) {
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
				} else
				if (res.data.data.result == 1) {
					$location.path('/exchange');
				}
			});
		}
		$scope.freeBd = function() {
			$location.path('/freebd');
		}
		$scope.payBd = function() {
			$location.path('/paybd');
		}

		$scope.showShareTip = function() {
			_hmt.push(['_trackEvent', 'wx_share_index', 'wx_index_right_button']);
			shareTip();
		}
	}
]);

wxShareControllers.controller('myCouponListCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $routeParams, $http, $location, $rootScope) {
		var imgMap = {
			0: "",
			1: "",
			3: "ing_item",
			4: "success_item",
			5: "ood_item",
			6: "exchange_item",
		}

		$scope.init = function() {
			util.share();
			_hmt.push(['_trackPageview', '/wx_share_couponlist']);
			//_hmt.push(['_trackEvent', 'wx_share_couponlist', 'index_center']);


			$scope.exchangePromise = getHttpPromise($http, $rootScope, 'POST', api['getCoupons'], {
			}, function(res) {
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
					$("#reason_container").show();
				} else if (res.data.code == 0) {
					if (res.data.data.coupons) {
						res.data.data.coupons.forEach(function(coupon) {
							coupon.imgClass = imgMap[coupon["coupon_status"]];
						})
						$scope.reason = "";
						if (res.data.data.coupons.length === 0) {
							$("#reason_container").show();
						}
						$scope.coupons = res.data.data.coupons;
						$(".ul_container").show();
					} else {
						$("#reason_container").show();
					}
				}

			});
		}
		$scope.goShare = function() {
			$location.path("/jixian");
		}
		$scope.goDetail = function(coupon_no, coupon_status, order_no, coupon_id, expiry_date) {
			_hmt.push(['_trackEvent', 'wx_share_couponlist', 'wx_share_couponlist_godetail']);
			//wx_list.html#/detail?order_no=P20160130000000122

			if (coupon_status === 4) {
				window.location.href = "/#bd_detail?order_no=" + order_no;


			} else
			if (coupon_status === 5) {
				util.showToast($rootScope, "优惠券已经过期，邀请更多的好友领取，可以再次免费获得优惠券");
			} else
			if (coupon_status === 1) {
				//window.location.href = "wx_share.html#/freebd?coupon_no=" + coupon_no + "&coupon_id=" + coupon_id + "&expiry_date=" + expiry_date;
				$location.path('freebd').search({
					coupon_no: coupon_no,
					coupon_id: coupon_id,
					expiry_date: expiry_date
				});
			} else {
				util.showToast($rootScope, "优惠券暂时无法使用，邀请更多的好友领取，可以再次免费获得优惠券");
			}
		}
		$scope.init();
	}
]);