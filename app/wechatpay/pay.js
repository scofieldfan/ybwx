/*
 * @Author: fanzhang
 * @Date:   2016-08-23 13:18:46
 * @Last Modified by:   fanzhang
 * @Last Modified time: 2016-09-02 19:24:27
 */

'use strict';

function getHttpPromise($http, method, url, data, callback) {

	data["open_id"] = '--';
	data["wechat_type"] = 2;
	return $http({
		method: method,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		url: url,
		data: data
	}).then(function(res) {
		console.log(res);
		if ((res && res.data && res.data.data) || (res && res.data && res.data.code === 0)) {
			callback(res);
		} else {
			util.showToastJQ(res.data.description);
		}
	}, function(res) {
		console.log(res);
		_hmt.push(['_trackEvent', 'http_error', "api:" + url]);
		util.showToastJQ("网络异常");
	});
}

var app = angular.module("wxPayPageApp", ['ngRoute']);


app.controller('wechatPayCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http',
	function($scope, $filter, $routeParams, $location, $http) {

		_hmt.push(['_trackPageview', $location.path()]);

		$scope.init = function() {

			$scope.CHANNEL_BANK_CARD = "1";
			$scope.CHANNEL_WECHAT = "4";
			$scope.CHANNEL_DTB_PAY = "5";

			$scope.plans = {};
			var paramObj = $location.search();
			$scope.insurance_name = paramObj.insurance_name;
			$scope.insurance_plan_name = paramObj.insurance_plan_name;
			$scope.order_amount = paramObj.order_amount;
			$scope.plans = JSON.parse(sessionStorage.getItem("sell_plan"));
			$scope.order_id = paramObj.order_id;
			$scope.order_no = paramObj.order_no;
			$scope.channels = paramObj.channels || [$scope.CHANNEL_BANK_CARD,$scope.CHANNEL_WECHAT];
			$scope.isHaveWechat = $scope.channels.indexOf($scope.CHANNEL_WECHAT) >=0;
			$scope.isHaveDtb = $scope.channels.indexOf($scope.CHANNEL_DTB_PAY) >=0;
			$scope.isHaveBankCard = $scope.channels.indexOf($scope.CHANNEL_BANK_CARD) >=0;
			
			// alert("$scope.channels:"+$scope.channels);
			// alert("isHaveDtb:"+$scope.isHaveDtb);
			if( $scope.isHaveWechat){
				getPayInfoAll($scope.order_id,$scope.CHANNEL_WECHAT);
			}
			if( $scope.isHaveDtb){
				getPayInfoAll($scope.order_id,$scope.CHANNEL_DTB_PAY);
			}
			// if( $scope.isHaveBankCard){
			// 	getPayInfoAll($scope.order_id,$scope.CHANNEL_BANK_CARD);
			// }
			
		}


		function setPayInfo(orderId, channelType, info) {
			sessionStorage.setItem(orderId + "_" + channelType, JSON.stringify(info));
		}

		function getPayInfo(orderId, channelType) {
			return JSON.parse(sessionStorage.getItem(orderId + "_" + channelType));
		}

		function wechatPay(successCallback) {

			return $.when($.ajax({
				type: 'GET',
				url: util.api["signature"] + '?__f=pay',
				data: {
					"url": location.href.split('#')[0],
					type: 2
				},
				dataType: "json"
			})).done(function(res) {
				//依赖于微信的JS
				var timestamp = res.data["timestamp"];
				var nonceStr = res.data["noncestr"];
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: res.data["app_id"], // 必填，公众号的唯一标识
					timestamp: timestamp, // 必填，生成签名的时间戳
					nonceStr: nonceStr, // 必填，生成签名的随机串
					signature: res.data["signature"], // 必填，签名，见附录1
					jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});

				wx.ready(function() {
					if (successCallback) {
						successCallback(timestamp, nonceStr);
					}
				});

			})

		}

		$scope.submit = function() {

			_hmt.push(['_trackEvent', 'pay', 'pay_subBtn']);
			var channelType = $(".pay_container").find(".choose").attr("data-channel-type");
			if (channelType === $scope.CHANNEL_BANK_CARD) { //银行卡支付
				if ($scope.redirectUrl) {
					window.location.href = $scope.redirectUrl;
				} else {
					util.showToastJQ("银行卡支付出错，暂时无法使用");
				}
			} else if (channelType === $scope.CHANNEL_WECHAT) { //微信支付
				wechatPay(function(timestamp, nonceStr) {
					wx.chooseWXPay({
						timestamp: $scope.wechat_response.timestamp,
						nonceStr: $scope.wechat_response.nonceStr, // 支付签名随机串，不长于 32 位
						package: $scope.wechat_response.packageStr, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
						signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: $scope.wechat_response.paySign, // 支付签名
						success: function(res) {
							// 支付成功后的回调函数
							//alert("支付成功");
							//alert(JSON.stringify(res));
							// window.location.href = "/#/pay_success?plans="+sessionStorage.getItem("sell_plan");
							window.location.href = "/#/pay_success";

							
						},
						cencel: function(res) {　　　　　　　　　　　　　　 // 支付取消回调函数
							//alert('cencel pay');
							//alert(JSON.stringify(res));
						},
						fail: function(res) {　　　　　　　　　　　　　　 // 支付失败回调函数
							// alert('pay fail');
							// alert(JSON.stringify(res));
							util.showToastJQ("支付失败");
						}
					});
				})

			}else if (channelType === $scope.CHANNEL_DTB_PAY) { //银行卡支付
				if ($scope.redirectUrl) {
					window.location.href = $scope.redirectUrl;
				} else {
					util.showToastJQ("微信支付 ，暂时无法使用");
				}
			}
		}
		function getPayInfoAll(order_id, channelType) {

			if (channelType == $scope.CHANNEL_WECHAT) {
				var wechat_response = getPayInfo(order_id, $scope.CHANNEL_WECHAT);
				if (wechat_response) {
					$scope.wechat_response = wechat_response;
				} else {
					$scope.ajaxPayInfo($scope.CHANNEL_WECHAT);
				}
			} else if (channelType == $scope.CHANNEL_BANK_CARD) {
				var url = getPayInfo(order_id, $scope.CHANNEL_BANK_CARD);

				if (url) {
					$scope.redirectUrl = url;
				} else {
					$scope.ajaxPayInfo($scope.CHANNEL_BANK_CARD);
				}

			}else if (channelType == $scope.CHANNEL_DTB_PAY) {
				var url = getPayInfo(order_id, $scope.CHANNEL_DTB_PAY);

				if (url) {
					$scope.redirectUrl = url;
				} else {
					$scope.ajaxPayInfo($scope.CHANNEL_DTB_PAY);
				}

			}



		}
		$scope.ajaxPayInfo = function(channelType) {
			$scope.payPromise = getHttpPromise($http, 'POST', '/ybwx-web/api/insurance/pay', {
				pay_order_id: $scope.order_id,
				pay_channel_type: channelType,
				wechat_type: 2
			}, function(res) {
				console.log(res);
				if (res && res.data && res.data.data && res.data.code === 0) {
					if (channelType == $scope.CHANNEL_BANK_CARD) { //银行卡
						$scope.redirectUrl = res.data.data.pp_response.pp_url;
						setPayInfo($scope.order_id, $scope.CHANNEL_BANK_CARD, $scope.redirectUrl)
					} else if (channelType == $scope.CHANNEL_WECHAT) { //微信

						$scope.wechat_response = res.data.data.wechat_response;
						setPayInfo($scope.order_id, $scope.CHANNEL_WECHAT, $scope.wechat_response);

					}else if (channelType == $scope.CHANNEL_DTB_PAY) { //大特保微信

						$scope.redirectUrl = res.data.data.dtb_pay_response.pay_url;
						setPayInfo($scope.order_id, $scope.CHANNEL_DTB_PAY, $scope.redirectUrl)
					}
				} else {
					util.showToastJQ(res.data.reason);
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
			getPayInfoAll($scope.order_id,channelType);
		}
	}
]);