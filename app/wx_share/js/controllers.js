'use strict';

/* Controllers */


var wxShareControllers = angular.module('wxShareControllers', []);

var shareUrl = 'http://web.youbaowuxian.com/wx_share.html';
var api = {
	"saveBd": "/ybwx-web/api/use_coupon",
	'addCoupon': '/ybwx-web/api/add_coupon',
	'getCoupons': '/ybwx-web/api/get_coupons',
	'addFreeBd': '/ybwx-web/api/use_coupon',
	'send_bd': '/ybwx-web/api/send_policy',
	'ping_coupon': '/ybwx-web/api/ping_coupon',
	'exchange': '/ybwx-web/api/exchange_coupon',
	"test": "/ybwx-web/api/test",
	'pre_insure': '/ybwx-web/api/insurance/pre_insure'
}

function shareTip() {
	$("#share").show();
}



function submitBd($scope, $http, $location, $filter) {
	var openId = sessionStorage.getItem("openId");
	var insuranceDate = $filter('date')($scope.user.insurance_date, "yyyyMMdd");
	var postData = {
		coupon_no: $scope.coupon_no,
		open_id: openId,
		username: $scope.user.username,
		social_id: $scope.user.social_id,
		mobile: $scope.user.mobile,
		insure_date: insuranceDate
	};
	// if ($scope.coupon_id == 2) {
		postData["flight_no"] = $scope.user.flight_no;
	// }
	return $http({
		method: 'POST',
		headers: {
			"Content-Type": "application/json;charset:UTF-8"
		},
		url: api['saveBd'],
		data: postData
	})

}
wxShareControllers.controller('sportsCtrl', ['$scope', '$filter', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $filter, $routeParams, $http, $location, $rootScope) {
		var qd = util.getParameterByName("qd");
		if (!qd) {
			qd = 'default';
		}
		_hmt.push(['_trackPageview', '/wx_share_index']);
		_hmt.push(['_setCustomVar', 1, 'qudao', qd, 1]);
		//_hmt.push(['_trackPageview', '/wx_share_index'+"_qd_"+qd]);
		$scope.init = function() {
			$scope.data = {
				remain_times: 1,
				recommend_times: 0
			}
			var code = util.getParameterByName("code");
			if (!code) {
				code = $routeParams.code;
			}
			$("#loadingToastCommon").show();
			weixinShareUtil.share(shareUrl, false, code).then(function() {
				$("#loadingToastCommon").hide();
				var openId = sessionStorage.getItem("openId");
				$http({
					method: 'POST',
					headers: {
						"Content-Type": "application/json;charset:UTF-8"
					},
					url: api['ping_coupon'],
					data: {
						"open_id": openId,
						"coupon_id": "4"
					}
				}).then(function(res) {
					console.log(res);
					if (res.data && res.data.description) {
						//util.showToast($rootScope, res.data.description);
					} else if (res.data.code === 0) {
						$scope.data = res.data.data;
						// console.log($scope.data);
						if (res.data.data.recommend_times > 0) {
							$("#coupons_container").show();
						}
					}
					// showToast($rootScope,res.data.description);
				}, function(res) {
					console.log(res);
					util.showToast($rootScope, "服务器错误");
				});
			})
		}
		$scope.init();
		$scope.sportsAddCoupon = function() {
			_hmt.push(['_trackEvent', 'wx_share_index', 'wx_share_index_left_button']);
			var recId = util.getParameterByName('rec_id');
			var openId = sessionStorage.getItem("openId");
			$http({
				method: 'POST',
				headers: {
					"Content-Type": "application/json;charset:UTF-8"
				},
				url: api['addCoupon'],
				data: {
					"open_id": openId,
					"r_open_id": recId,
					"coupon_id": "4"
				}
			}).then(function(res) {
				console.log(res);
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
				}
				// showToast($rootScope,res.data.description);
				if (res.data.code == 0) {
					$location.path('/success_coupon').search({
						count: (res.data.data["coupon_counts"] + 1)
					});
				}
			}, function(res) {
				console.log(res);
				util.showToast($rootScope, "服务器错误");
			});
		}
		$scope.showShareTip = function() {
			_hmt.push(['_trackEvent', 'wx_share_index', 'wx_index_right_button']);
			shareTip();
		}
	}
]);
wxShareControllers.controller('wxShareBdCtrl', ['$scope', '$filter', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $filter, $routeParams, $http, $location, $rootScope) {
		_hmt.push(['_trackPageview', "/wx_share_toubao"]);
		$scope.coupon_id = $routeParams.coupon_id;
		$scope.expiry_date = $routeParams.expiry_date;
		$scope.coupon_no = $routeParams.coupon_no;
		var testDate = new Date();
		testDate.setDate(testDate.getDate() + 1);
		$scope.minDate = testDate;
		$scope.maxDate = $scope.expiry_date;

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
		var openId = sessionStorage.getItem("openId");
		// toggle
		function addDays(date,days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		} 
		$scope.genInEffectiveDate = function() {
		//计算失效日期
			//console.log("test ineffective Date.........");
			//console.log($scope.user.insurance_date);
			
			//console.log(addDays($scope.user.insurance_date,3));

			$scope.user.inEnd_date = addDays($scope.user.insurance_date,3);
		}
		
		$scope.submit = function() {
			_hmt.push(['_trackEvent', 'wx_share_toubao', 'wx_share_toubao_subtn']);

			console.log($scope.registration);
			console.log("invalid:"+$scope.registration.$invalid);
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
				if ($scope.registration.flight_no.$invalid) {
						util.showToast($rootScope, "航班号必须填写");
				}
				if ($scope.registration.insurance_date.$invalid) {
					util.showToast($rootScope, "保障日期填写有误，请修改");
				}
			}
		}
        // $('#birthday').focus(function() {
        // 	this.type = 'date';
        // 	// this.focus();
        // })
		
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
				var openId = sessionStorage.getItem("openId");
				util.sendMail($http, $rootScope, api['send_bd'], openId, $scope.user.email, $location.search().order_no);

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
		var qd = util.getParameterByName("qd");
		if (!qd) {
			qd = 'default';
		}
		_hmt.push(['_trackPageview', '/wx_share_index']);
		_hmt.push(['_setCustomVar', 1, 'qudao', qd, 1]);
		//_hmt.push(['_trackPageview', '/wx_share_index'+"_qd_"+qd]);
		$scope.init = function() {
			$scope.data = {
				remain_times: 1,
				recommend_times: 0
			}
			var code = util.getParameterByName("code");
			if (!code) {
				code = $routeParams.code;
			}
			$("#loadingToastCommon").show();
			weixinShareUtil.share(shareUrl, false, code).then(function() {
				$("#loadingToastCommon").hide();
				var openId = sessionStorage.getItem("openId");
				$http({
					method: 'POST',
					headers: {
						"Content-Type": "application/json;charset:UTF-8"
					},
					url: api['ping_coupon'],
					data: {
						"open_id": openId,
						"coupon_id": "2"
					}
				}).then(function(res) {
					console.log(res);
					if (res.data && res.data.description) {
						//util.showToast($rootScope, res.data.description);
					} else if (res.data.code === 0) {
						$scope.data = res.data.data;
						//console.log($scope.data);
						if (res.data.data.recommend_times > 0) {
							$("#coupons_container").show();
						}
					}
					// showToast($rootScope,res.data.description);
				}, function(res) {
					console.log(res);
					util.showToast($rootScope, "服务器错误");
				});
			})
		}
		$scope.init();
		$scope.addCoupon = function() {
			_hmt.push(['_trackEvent', 'wx_share_index', 'wx_share_index_left_button']);
			var recId = util.getParameterByName('rec_id');
			var openId = sessionStorage.getItem("openId");
			$http({
				method: 'POST',
				headers: {
					"Content-Type": "application/json;charset:UTF-8"
				},
				url: api['addCoupon'],
				data: {
					"open_id": openId,
					"r_open_id": recId,
					"coupon_id": "2"
				}
			}).then(function(res) {
				console.log(res);
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
				}
				// showToast($rootScope,res.data.description);
				if (res.data.code == 0) {
					$location.path('/success_coupon').search({
						count: (res.data.data["coupon_counts"] + 1)
					});
				}
			}, function(res) {
				console.log(res);
				util.showToast($rootScope, "服务器错误");
			});
		}
        $scope.exchange = function() {
			_hmt.push(['_trackEvent', 'wx_share_index', 'wx_share_index_exchange_button']);
	
			var openId = sessionStorage.getItem("openId");
			$http({
				method: 'POST',
				headers: {
					"Content-Type": "application/json;charset:UTF-8"
				},
				url: api['exchange'],
				data: {
					"open_id": openId
				}
			}).then(function(res) {
				console.log("tailu log .......");
				console.log(res);
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
				}else
				if (res.data.data.result == 1) {
					$location.path('/exchange');
				}
			}, function(res) {
				console.log(res);
				util.showToast($rootScope, "服务器错误");
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

			_hmt.push(['_trackPageview', '/wx_share_couponlist']);
			//_hmt.push(['_trackEvent', 'wx_share_couponlist', 'index_center']);
			var code = util.getParameterByName("code");
			if (!code) {
				code = $routeParams.code;
			}
			weixinShareUtil.share(shareUrl, false, code).then(function() {
				var openId = sessionStorage.getItem("openId");
				//  $scope.reason="您没有领取任何优惠券。";
				// $("#reason_container").show();
				$http({
					method: 'POST',
					headers: {
						"Content-Type": "application/json;charset:UTF-8"
					},
					url: api['getCoupons'],
					data: {
						"open_id": openId
					}
				}).then(function(res) {
					console.log(res);
					if (res.data && res.data.description) {
						util.showToast($rootScope, res.data.description);
						$("#reason_container").show();
					} else if (res.data.code == 0) {
						if (res.data.data.coupons) {
							res.data.data.coupons.forEach(function(coupon) {
								//  item.showDate = item["expiry_date"].substring(0,4)+"-"+item["expiry_date"].substring(4,6)+"-"+item["expiry_date"].substring(6);
								coupon.imgClass = imgMap[coupon["coupon_status"]];
								/*if(coupon.coupon_id == 2 || coupon.coupon_id == 3){
									if(coupon.coupon_status == 5 || coupon.coupon_status ==  6) {
                                      $(".logo_img").addClass("img_gray");
									}else {
                                      $(".logo_img").removeClass("img_gray");
									}
								}else{
                                      $(".logo_img").removeClass("img_gray");
								}*/
							})
							$scope.reason = "";
							if (res.data.data.coupons.length === 0) {
								$("#reason_container").show();
							}
							console.log(res.data.data.coupons);
							$scope.coupons = res.data.data.coupons;
							$(".ul_container").show();
						} else {
							$("#reason_container").show();
						}
					}
				}, function(res) {
					console.log(res);

					util.showToast($rootScope, "服务器错误");
				});
			})
		}
		$scope.goDetail = function(coupon_no, coupon_status, order_no, coupon_id, expiry_date) {
			_hmt.push(['_trackEvent', 'wx_share_couponlist', 'wx_share_couponlist_godetail']);
			//wx_list.html#/detail?order_no=P20160130000000122

			if (coupon_status === 4) {
				// util.showToast($rootScope,"优惠券已经投保成功，邀请更多的好友领取，可以再次免费获得优惠券");
				//alert("fuck you ");
				window.location.href = "/#bd_detail?order_no=" + order_no;
				//$location.path('bd_detail').search({
				//	order_no: order_no
				//});

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