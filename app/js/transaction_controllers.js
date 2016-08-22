'use strict';

/* Controllers */

var transControllers = angular.module('transactionControllers', []);
//交易记录列表
transControllers.controller('wxBaoDanListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		//setTest($routeParams.is_test);
		$scope.getBdStatus = function(status, bdStatus) {
			return getBdStatus(status, bdStatus);
		}
		$scope.getBdColor = function(status) {
			return insuranceColorMap[status]
		}

		var currentUrl = util.domain + "#bd_list";
		$scope.init = function() {

			util.checkCodeAndOpenId($routeParams.code, currentUrl, function() {
				$scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurances'], {
				}, function(res) {
					console.log("result ......");
					$scope.orders = res.data.data.orders;
				})

			});

		}


		$scope.filterFn = function(order) {
			if ($scope.tog === "") {
				return true;
			}
			if ($scope.tog === "1") { //待支付
				return order.status !== 4; //订单状态是待支付，true是留下来了。false是过滤完的
			} else {
				return order.insurance_orders.filter(function(item) {
					return parseInt(item["order_status"]) === parseInt($scope.tog);
				}).length > 0;

			}

		};

		$scope.goPay = function(order_id, order_no, order_amount) {
			_hmt.push(['_trackEvent', 'bd_list', 'bdlist_gopay']);
			$location.path('/pay_select').search({
				"insurance_name": "诺贝保险管家定制产品套餐",
				"insurance_plan_name": "诺贝保险管家定制产品套餐",
				"order_id": order_id,
				"order_no": order_no,
				"order_amount": order_amount
			});
		}
		$scope.goDetail = function(order_no, order_status) {
			_hmt.push(['_trackEvent', 'bd_list', 'bdlist_godetail']);
			$location.path('/bd_detail').search({
				'order_no': order_no,
				'order_status': order_status
			});
		}
		$scope.tog = "";
		//$scope.init();
	}
]);
//交易记录详情页
transControllers.controller('wxBaoDanDetailCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		console.log($routeParams.order_no);
		_hmt.push(['_trackPageview', $location.path()]);
		$scope.getBdStatus = function(status, bdStatus) {
			return getBdStatus(status, bdStatus);
		}
		$scope.getBdColor = function(status) {
			return insuranceColorMap[status]
		}
		$scope.init = function() {
			$scope.status = $routeParams.order_status;

			$scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurance_detail'], {
				'order_no': $routeParams.order_no
			}, function(res) {
				console.log(res);
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
				}
				if (res.data.code == 0) {
					//res.data.data.order.order_status_text = insuranceMap[res.data.data.order["order_status"]];
					$scope.order = res.data.data.order;
				}
			})
		}

		$scope.send_bd = function() {
			if (!sendForm.email.$invalid) {
				util.sendMail($http, $rootScope, api['send_bd'], $scope.user.email, $location.search().order_no);
				$scope.hideDialog();
			}
		}
		$scope.showDialog = function() {
			$("#email_dialog").show();
		}
		$scope.hideDialog = function() {
			$("#email_dialog").hide();
		}
		$scope.init();
	}
]);

transControllers.controller('ybwxWechatPayCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $filter, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);

		$scope.plans = {};
		$scope.insurance_name = $routeParams.insurance_name;
		$scope.insurance_plan_name = $routeParams.insurance_plan_name;
		$scope.order_amount = $routeParams.order_amount;

		$scope.plans = JSON.parse(sessionStorage.getItem("sell_plan"));



		function setPayInfo(orderId, channelType, info) {
			sessionStorage.setItem(orderId + "_" + channelType, JSON.stringify(info));
		}

		function getPayInfo(orderId, channelType) {
			return JSON.parse(sessionStorage.getItem(orderId + "_" + channelType));
		}

		$scope.order_id = $routeParams.order_id;
		$scope.order_no = $routeParams.order_no;

		$scope.submit = function() {


			_hmt.push(['_trackEvent', 'pay', 'pay_subBtn']);
			var channelType = $(".pay_container").find(".choose").attr("data-channel-type");

			if (channelType == "1") { //银行卡支付
				if ($scope.redirectUrl) {

					window.location.href = $scope.redirectUrl;
				} else {
					util.showToast($rootScope, "银行卡支付出错，暂时无法使用");
				}
			} else if (channelType == "4") { //现在支付微信
				//document.getElementById("wechatPayForm").submit();
				wx.chooseWXPay({
					timestamp: $scope.wechat_response.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: $scope.wechat_response.nonceStr, // 支付签名随机串，不长于 32 位
					package: $scope.wechat_response.packageStr, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: $scope.wechat_response.paySign, // 支付签名
					success: function(res) {
						// 支付成功后的回调函数
						alert("支付成功");
					}
				});


			}

		}
		$scope.ajaxPayInfo = function(channelType) {
			$scope.payPromise = getHttpPromise($http, $rootScope, 'POST', api['pay_new'], {
				pay_order_id: $routeParams.order_id,
				pay_channel_type: channelType,
				wechat_type: 2
			}, function(res) {
				console.log(res);
				if (res && res.data && res.data.data && res.data.code === 0) {
					if (channelType == "1") { //银行卡
						$scope.redirectUrl = res.data.data.pp_response.pp_url;
						setPayInfo($routeParams.order_id, "1", $scope.redirectUrl)
					} else if (channelType == "4") { //现在支付微信
						$scope.wechat_response = res.data.data.wechat_response;
						setPayInfo($routeParams.order_id, "4", $scope.wechat_response);


					}
				} else {
					util.showToast($rootScope, res.data.reason);
				}
			})
		}
		$scope.pay = function($event) {
			//获取支付信息
			if ($event) {
				var element = $event.currentTarget;
				$(".pay_item").removeClass("choose");
				$(element).addClass("choose");
			}
			var channelType = $(".pay_container").find(".choose").attr("data-channel-type");
			_hmt.push(['_trackEvent', 'pay', 'pay_select' + channelType]);
		}
		var url = getPayInfo($routeParams.order_id, "1");
		var wechat_response = getPayInfo($routeParams.order_id, "4")
		if (url) {
			$scope.redirectUrl = url;
		} else {
			$scope.ajaxPayInfo("1");
		}

		if (wechat_response) {
			$scope.wechat_response = wechat_response;
		} else {
			$scope.ajaxPayInfo("4");
		}


	}
]);



transControllers.controller('ybwxPaySelectNewCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
function($scope, $filter, $routeParams, $location, $http, $rootScope) {

	_hmt.push(['_trackPageview', $location.path()]);

	$scope.plans = {};
	$scope.insurance_name = $routeParams.insurance_name;
	$scope.insurance_plan_name = $routeParams.insurance_plan_name;
	$scope.order_amount = $routeParams.order_amount;

	$scope.plans = JSON.parse(sessionStorage.getItem("sell_plan"));



	function setPayInfo(orderId, channelType, info) {
		sessionStorage.setItem(orderId + "_" + channelType, JSON.stringify(info));
	}

	function getPayInfo(orderId, channelType) {
		return JSON.parse(sessionStorage.getItem(orderId + "_" + channelType));
	}

	$scope.order_id = $routeParams.order_id;
	$scope.order_no = $routeParams.order_no;

	$scope.submit = function() {


		_hmt.push(['_trackEvent', 'pay', 'pay_subBtn']);
		var channelType = $(".pay_container").find(".choose").attr("data-channel-type");

		if (channelType == "1") { //银行卡支付
			if ($scope.redirectUrl) {

				window.location.href = $scope.redirectUrl;
			} else {
				util.showToast($rootScope, "银行卡支付出错，暂时无法使用");
			}
			//   window.location.href =  $scope.redirectUrl;
		} else if (channelType == "3") { //现在支付微信
			document.getElementById("wechatPayForm").submit();
		}

	}
	$scope.ajaxPayInfo = function(channelType) {
		$scope.payPromise = getHttpPromise($http, $rootScope, 'POST', api['pay_new'], {
			pay_order_id: $routeParams.order_id,
			pay_channel_type: channelType,
			wechat_type: 2
		}, function(res) {
			console.log(res);
			if (res && res.data && res.data.data && res.data.code === 0) {
				if (channelType == "1") { //银行卡
					$scope.redirectUrl = res.data.data.pp_response.pp_url;
					setPayInfo($routeParams.order_id, "1", $scope.redirectUrl)
				} else if (channelType == "3") { //现在支付微信
					$scope.ipaynow_pay_request = res.data.data.ipaynow_pay_request;
					setPayInfo($routeParams.order_id, "3", $scope.ipaynow_pay_request)
				}
			} else {
				util.showToast($rootScope, res.data.reason);
			}
		})
	}
	$scope.pay = function($event) {
		//获取支付信息
		if ($event) {
			var element = $event.currentTarget;
			$(".pay_item").removeClass("choose");
			$(element).addClass("choose");
		}
		var channelType = $(".pay_container").find(".choose").attr("data-channel-type");
		_hmt.push(['_trackEvent', 'pay', 'pay_select' + channelType]);
	}
	var url = getPayInfo($routeParams.order_id, "1");
	var ipayNowRequest = getPayInfo($routeParams.order_id, "3")
	if (url) {
		$scope.redirectUrl = url;
	} else {
		$scope.ajaxPayInfo("1");
	}
	if (ipayNowRequest) {
		$scope.ipaynow_pay_request = ipayNowRequest;
	} else {
		$scope.ajaxPayInfo("3");
	}


}


]);