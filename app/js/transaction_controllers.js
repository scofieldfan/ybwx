'use strict';

/* Controllers */

var transControllers = angular.module('transactionControllers', []);

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

		/*
		$scope.page_no = 1;
		$scope.page_size = 5;
		$scope.orders = [];
		$scope.isBusy = true;
		$scope.nextPage = function() {
			if ($scope.isBusy) return;
			$scope.isBusy = true;
			var openId = sessionStorage.getItem("openId");
			$http({
				method: 'POST',
				headers: {
					"Content-Type": "application/json;charset:UTF-8"
				},
				url: api['get_insurances'],
				data: {
					"open_id": openId,
					"page_no": $scope.page_no,
					"page_size": $scope.page_size
				}
			}).then(function(res) {
				console.log(res);
				$scope.isBusy = false;
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
					//  $(".default_text").show();
				}
				if (res.data.code == 0) {
					if (res.data.data.orders) {
						$scope.page_no++;
						console.log(res.data.data.orders);
						res.data.data.orders.forEach(function(element, index) {
							$scope.orders.push(element);
							// statements
						});
						//$scope.orders.concat(res.data.data.orders);
						console.log("...............");
					}
				}
			}, function(res) {
				$scope.isBusy = false;
				console.log(res);
				util.showToast($rootScope, "服务器错误");
				// $(".default_text").show();
			});
		}*/
		$scope.init = function() {

			var code = util.getParameterByName("code");
			if (!code) {
				code = $routeParams.code;
			}
			util.getOpenId(code).then(function() {
				var openId = sessionStorage.getItem("openId");
				$scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurances'], {
					'open_id': openId
				}, function(res) {
					console.log("result ......");
					$scope.orders = res.data.data.orders;
				})

				//$scope.isBusy = false;
				//$scope.nextPage();
				//$scope.reason="您没有领取任何优惠券。";
				// $("#reason_container").show();

			})
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

			/*
			console.log(order.order_status)
			console.log($scope.tog)
			console.log(order.order_status === $scope.tog);*/
			//return parseInt(order.order_status_enum) === parseInt($scope.tog);
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
			var openId = sessionStorage.getItem("openId");
			$scope.status = $routeParams.order_status;

			$scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurance_detail'], {
				"open_id": openId,
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
				var openId = sessionStorage.getItem("openId");
				util.sendMail($http, $rootScope, api['send_bd'], openId, $scope.user.email, $location.search().order_no);
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