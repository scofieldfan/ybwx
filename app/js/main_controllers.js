'use strict';

/* Controllers */

var mainControllers = angular.module('mainControllers', []);

var api = {
		'get_insurances': '/ybwx-web/api/insurance_orders',
		'get_insurance_detail': '/ybwx-web/api/insurance_order',
		'get_insurance_index': '/ybwx-web/api/aggregate_score',
		'get_insurances_selling': '/ybwx-web/api/insurance/selling',
		'get_insurances_detail': '/ybwx-web/api/insurance/plans',
		'get_insurances_mask': '/ybwx-web/api/insurance/float/{productId}',
		'get_recommend': '/ybwx-web/api/recommend_view/{type}',
		'get_recommend_coverages': '/ybwx-web/api/recommend_coverages',
		'get_recommend_plans': '/ybwx-web/api/recommend_plans',
		'get_estimate_money': '/ybwx-web/api/recommend_premium',
		'get_restrictions': '/ybwx-web/api/recommend_restrictions',
		'get_score_analysis': '/ybwx-web/api/score_analysis/{openId}/{type}',
		'get_industries_1': '/ybwx-web/api/industries',
		'get_industries_2': '/ybwx-web/api/occupations/',
		'get_industries_3': '/ybwx-web/api/jobs/',
		'pre_insure': '/ybwx-web/api/insurance/pre_insure',
		'insure': '/ybwx-web/api/insurance/insure',
		'send_bd': '/ybwx-web/api/send_policy',
		'pay': '/ybwx-web/api/pay',
		'get_user_info': '/ybwx-web/user/info/wechat/{openId}',
		'set_user_info': '/ybwx-web/user/info/update',
		'upload_policy_image': '/ybwx-web/api/upload_policy_image',
		'get_policies_list': '/ybwx-web/api/policies',
		'get_policy_detail': '/ybwx-web/api/policy',
		'signature': '/ybwx-diplomat/wechat/js_signature',
		'get_claim_info': '/ybwx-web/api/claim_info/{id}',
		'get_verfiy_policy': '/ybwx-web/api/policies/verify',
		'policy_verfiy': '/ybwx-web/api/verify',
		'get_policy_verfiyinfo': '/ybwx-web/api/verify_info/{id}'
	}
	//测试开始，为了测试做的适配
	/*
var api_test = {};
for (var key in api) {
	api_test[key] = "/test" + api[key];
}

function setTest(is_test) {
	var isTest = false;
	if (is_test === 'true') {
		isTest = true;
	}
	if (isTest) {
		api = api_test;
		sessionStorage.setItem("is_test", true);
	} else {
		sessionStorage.setItem("is_test", false);
	}
}
*/
	//测试结束
	//console.log(api_test);

var insuranceMap = {
	'1': '投保中',
	'6': '待生效',
	'7': '投保失败',
	'8': '保障中',
	'9': '已失效'
}
var chargePeriodTypeMap = {
	'1': '趸交',
	'2': '按月缴',
	'3': '按年缴',
	'4': '趸交和按月缴',
	'5': '趸交和按年缴'
}
var chargePeriodTypeAbbreMap = {
		'1': '趸交',
		'2': '月',
		'3': '年',
		'4': '趸交和按月缴',
		'5': '趸交和按年缴'
	}
	/*
}
var insuranceMap = {
	'1': '投保中',
	'6': '投保成功',
	'7': '投保失败',
	'8': '保障中',
	'9': '已失效'
}
*/

var greenColor = "#82ce6a";
var redColor = "#ff5c00";
var grayColor = "#808080";
var insuranceColorMap = {
	'1': redColor,
	'2': redColor,
	'3': redColor,
	'4': greenColor,
	'5': redColor,
	'6': greenColor,
	'7': grayColor,
	'8': greenColor,
	'9': grayColor
}

/* 
1 待支付，2 支付失败 3投保中，4待生效 5 投保失败 6 保障中，7已失效
*/
//用于筛选，给每个订单一个筛选情况
/*
var insuranceEnumMap = {
	'1': 1,
	'2': 1,
	'3': 2,
	'4': 3,
	'5': 2,
	'6': 4,
	'7': 5,
	'8': 6,
	'9': 7
};*/

/*
CREATE(1, "保单创建成功"),                     
ACCEPT_SUCCESS(2, "保单支付请求受理成功"),      
ACCEPT_FAILURE(3, "保单支付请求受理失败"),       
PAY_SUCCESS(4, "保单支付成功"),                     
PAY_FAILURE(5, "保单支付失败"),                   
INSURE_SUCCESS(6, "保单投保成功"),                    
INSURE_FAILURE(7, "保单投保失败"),                     
INSURANCE_EFFECTIVE(8, "保单生效"),                 
INSURANCE_INEFFECTIVE(9, "保单失效");             
*/



//图标Index：保险类型
var insureTypeMap = [4, 3, 2, 1, 5];
var insureanceCNMap = {
	1: "家庭",
	2: "健康",
	3: "人寿",
	4: "意外",
	5: "财产"
}

/*
FAMILY(1, "家庭保险")
HEALTH(2, "健康保险")
LIFE(3, "人寿保险")
ACCIDENT(4, "意外保险")
WEALTH(5, "财产保险")*/



function getBdStatus(orderStatus, bdStatus) {

	//未支付成功，都显示待支付。支付订单是4，表示支付成功。此时要看保单状态
	if (parseInt(orderStatus) === 4 || orderStatus === undefined) {
		return insuranceMap[bdStatus];
	} else {
		return "待支付";
	}
}


function getHttpPromise($http, $rootScope, method, url, data, callback) {
	return $http({
		method: method,
		headers: {
			"Content-Type": "application/json;charset:UTF-8"
		},
		url: url,
		data: data
	}).then(function(res) {
		console.log(res);
		if ((res && res.data && res.data.data) || (res && res.data && res.data.code === 0)) {
			callback(res);
		} else {
			util.showToast($rootScope, res.data.description);
		}
	}, function(res) {
		console.log(res);
		_hmt.push(['_trackEvent', 'http_error', "api:" + url]);
		util.showToast($rootScope, "服务器错误");
	});
}



mainControllers.controller('ybwxUserinfoCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);

		$scope.submit = function() {
			$scope.gender = $(".switch-input").is(':checked') ? 2 : 1;
			$scope.age = $("#age").html();
			var openId = sessionStorage.getItem("openId");
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'POST', api['set_user_info'], {
				'open_id': openId,
				'gender': $scope.gender,
				'age': $scope.age
			}, function(res) {
				console.log(res.data.data);
				$location.path('/select').search({
					'type': $routeParams.type
				});
			})
		}


	}
]);

mainControllers.controller('wxBaoDanListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
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

mainControllers.controller('wxBaoDanDetailCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
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


function initPieConfig(sumScore, scores, policyNumber) {
	var pieConfig = [

		{
			"text": "意外",
			"percent": scores[4] / 10,
			"icon": "\uf21e",
			"img": "img/feiji.png",
			"isDisable": true,
			"color": "#f0d8dc",
			"textColor": "#ea8094",
			"hoverColor": "#fffafa"
		}, {
			"text": "人寿",
			"percent": scores[3] / 10,
			"icon": "\uf155",
			"img": "img/yiliao.png",
			"isDisable": true,
			"color": "#d1e5f3",
			"textColor": "#5796c3",
			"hoverColor": "#fffefa"
		}, {
			"text": "健康",
			"percent": scores[2] / 10,
			"isDisable": true,
			"icon": "\uf1b9",
			"img": "img/jiankang.png",
			"color": "#c6e7db",
			"textColor": "#60bd9b",
			"hoverColor": "#fafffc"
		}, {
			"text": "家庭",
			"percent": scores[1] / 10,
			"isDisable": false,
			"icon": "\uf072",
			"img": "img/jiating.png",
			"color": "#e0d4e8",
			"textColor": "#ac80c9",
			"hoverColor": "#fbfdff"
		}, {
			"text": "财产",
			"percent": scores[5] / 10,
			"icon": "\uf278",
			"img": "img/qian.png",
			"isDisable": true,
			"color": "#e2dccb",
			"textColor": "#d4bd78",
			"hoverColor": "#fdfcff"
		}
	];

	$('#piemenu').pieMenu({}, {
		elementStyle: {
			position: 'absolute'
		},
		pieConfig: pieConfig,
		sumScore: sumScore,
		policyNumber: policyNumber,
		parentElement: $("#pieChartContainer"),
		onSelection: function(pieIndex) {
			if (pieIndex == 'x') {
				window.location = "#/bdm_list";
				_hmt.push(['_trackEvent', 'index', 'index_center']);
			} else {
				_hmt.push(['_trackEvent', 'index', 'index_' + pieIndex]);
				if (pieIndex == '0' || pieIndex == '1' || pieIndex == '2') {
					window.location = "#/bd_education?type=" + insureTypeMap[pieIndex];
				} else {
					window.location = "#/continue";
				}
			}
		}
	});
}

mainControllers.controller('ybwxIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		$scope.data = {
			aggregate_score: 0
		}
		$scope.showTip = function() {
			_hmt.push(['_trackEvent', 'index', 'index_showTip']);
			$("#share").show();
		}
		$scope.goBdMange = function() {
			_hmt.push(['_trackEvent', 'index', 'index_baodan_guanli']);
			$location.path('/bdm_list').search();
		}
		$scope.goVerfiy = function() {
			$location.path('/bd_verify_list').search();
		}
		$scope.init = function() {
			//获得openId
			//setTest($routeParams.is_test);
			var code = util.getParameterByName("code") || $routeParams.code;
			util.getSign();
			util.getOpenId(code).then(function() {

				/*
					判断是否第一次进入
				*/
				var isFirstTime = localStorage.getItem("isVisited");
				if (!isFirstTime) {
					$location.path('/edindex');
				}

				var openId = sessionStorage.getItem("openId");
				$http({
					method: 'GET',
					headers: {
						"Content-Type": "application/json;charset:UTF-8"
					},
					url: api['get_insurance_index'] + "/" + openId

				}).then(function(res) {
					console.log(res);
					if (res.data && res.data.description) {
						util.showToast($rootScope, res.data.description);
					}
					if (res.data.code == 0) {
						$("#loadingContainer").hide();
						$scope.data = res.data.data;
						initPieConfig($scope.data.aggregate_score.toFixed(1), $scope.data.scores, $scope.data.policy);
					}
				}, function(res) {
					console.log(res);
					util.showToast($rootScope, "服务器错误");
				});
			})

		}
	}
]);
var scoreObj = {
	fanweiScore: 0,
	moneyScore: 0
};

var sum_score = 0;

function updateSumScore() {
	if (scoreObj.fanweiScore == 0) {
		if (SLIDER) {
			SLIDER.reset();
		}
	}
	if (scoreObj.moneyScore == 0) {
		sum_score = 0;
	} else {
		sum_score = Math.floor((scoreObj.fanweiScore + scoreObj.moneyScore) / 2);
	}
	$("#sum_score").html(sum_score);
	if (scoreObj.fanweiScore != 0 && scoreObj.moneyScore != 0) {
		$("#dzSbButton").removeClass("btn_n_primary_default").addClass("btn_n_primary")
	} else {
		$("#dzSbButton").removeClass("btn_n_primary").addClass("btn_n_primary_default");
	}
	var element = angular.element(document.getElementById('clockContainer'));
	if (element && element.scope() && element.scope().goEstimateMoney) {
		element.scope().goEstimateMoney();
	}


}

mainControllers.controller('ybwxSelectCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);
		$scope.init = function() {
			$scope.type = $routeParams.type;
			$scope.estimateMoney = 0;
			$http({
				method: 'GET',
				headers: {
					"Content-Type": "application/json;charset:UTF-8"
				},
				url: api['get_recommend'].replace('{type}', $routeParams.type)
			}).then(function(res) {
				console.log(res);
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
				}
				if (res.data.code == 0) {
					var sumInsuredView = [];

					_.map(res.data.data.sum_insured_views, function(value, key) {
						//console.log(value);
						var objKey = _.groupBy(value, function(val, index) {
							return index % 2;
						}); //后台只留偶数部分，找巴哥咨询
						//console.log(objKey);
						sumInsuredView[key] = objKey[1];
						// return [key, objKey[1]];
						// return [key, value * value];
					});
					// console.log(obj);
					//console.log(sumInsuredView);
					CIRCLE.init(res.data.data.coverage_scores, res.data.data.coverage_views, sumInsuredView);
				}
			}, function(res) {
				console.log(res);
				util.showToast($rootScope, "服务器错误");
			});
		}

		$scope.goEstimateMoney = function() {
			if (scoreObj.fanweiScore == 0 || scoreObj.moneyScore == 0) {
				$scope.estimateMoney = 0;
				$scope.$apply();
			} else {
				$http({
					method: 'POST',
					headers: {
						"Content-Type": "application/json;charset:UTF-8"
					},
					url: api['get_estimate_money'],
					data: {
						"insurance_type": $routeParams.type, // 保险类型
						"coverage_score": scoreObj.fanweiScore, // 保障分
						"sum_insured_score": scoreObj.moneyScore // 保额分
					}
				}).then(function(res) {
					/*
				console.log(res);
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
				}*/
					if (res.data.code == 0) {
						$scope.estimateMoney = Math.floor(res.data.data / 100);
					}
				}, function(res) {
					console.log(res);
					//util.showToast($rootScope, "服务器错误");
				});
			}

		}
		$scope.goBz = function() {
			_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_subBtn']);
			if (scoreObj.fanweiScore == 0 || scoreObj.moneyScore == 0) {
				util.showToast($rootScope, "请选择保障范围和保障额度");
				return false;
			}
			$location.path('/bz').search({
				'type': $routeParams.type,
				'coverage_score': scoreObj.fanweiScore,
				'sum_insured_score': scoreObj.moneyScore,
				'estimate_money': $scope.estimateMoney,
				'sum_score': sum_score
			});
		}
		$scope.showIntrod = function() {
			_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_showIntrod']);
			$("#baozhang_popup").show();
		}
		$scope.showCompute = function() {
			$("#baozhang_compute").show();
		}
		$scope.goJingzhun = function() {
			_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_jingzhunBtn']);
			$location.path('/jingzhun').search({
				'type': $routeParams.type
			});
		}
	}
]);
mainControllers.controller('ybwxJingzhunCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);

		//insurance_type":1
        $scope.isHaveResult = true;
		$scope.init = function() {
			var openId = sessionStorage.getItem("openId");
			$scope.listPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurances_selling'], {
				"open_id": openId,
				"insurance_type": $routeParams.type
			}, function(res) {
				console.log(res);
				if (res && res.data && res.data.data) {
					$scope.list = res.data.data.insurances;
					if (res.data.data.insurances && 　res.data.data.insurances.length > 0) {
		            $scope.isHaveResult = true;
		          } else {
		            $scope.isHaveResult = false;
		          }
				}
			})
		}
		$scope.goDetail = function(id) {
			$location.path("/detail").search({
				"product_id": id
			});
		}

		$scope.goLairen = function() {
			$location.path('/select').search({
				'type': $routeParams.type
			});
		}


	}
]);

mainControllers.controller('ybwxInfoCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		$scope.showTip = function() {
			_hmt.push(['_trackEvent', 'information', 'information_yesBtn']);
			util.showToast($rootScope, "对不起，您不符合当前方案的投保条件");
		}
		$scope.goToubao = function() {
			_hmt.push(['_trackEvent', 'information', 'information_subBtn']);
			$location.path('/tb_dz').search({
				'type': $routeParams.type,
				'coverage_score': $routeParams.coverage_score,
				'sum_insured_score': $routeParams.sum_insured_score,
				'estimate_money': $routeParams.estimate_money,
				'sum_score': $routeParams.sum_score,
				'from': 'dingzhi'
			});
		}
		$scope.init = function() {

			$scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_restrictions'], {
				"insurance_type": $routeParams.type,
				"coverage_score": $routeParams.coverage_score,
				"sum_insured_score": $routeParams.sum_insured_score
			}, function(res) {
				$scope.data = res.data.data;
				if ($scope.data.notices) {
					_.map($scope.data.notices, function(item) {
						if (item.health_notice) {
							item.healthNotices = item.health_notice.split("\r\n");
						}
						return item;
					})
					console.log($scope.data.notices);
					$scope.isHaveHealth = _.filter($scope.data.notices, function(notice) {
						return notice.health_notice
					})
					$scope.isExtranotice = _.filter($scope.data.notices, function(notice) {
						return notice.extra_notice
					})
				}
			})
		}
	}
]);

mainControllers.controller('ybwxBzCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		$scope.sum_score = $routeParams.sum_score;
		$scope.estimate_money = $routeParams.estimate_money;
		$scope.processMoney = function(money) {
			var money = util.processSpecialMoney(money);
			if (money === "0元") {
				money = "";
			}
			return money;
		}
		$scope.goInfo = function() {

			_hmt.push(['_trackEvent', 'baozhangzeren', 'baozhangzeren_subBtn']);

			if (isHaveRestrictions) {
				$location.path('/information').search({
					'type': $routeParams.type,
					'coverage_score': $routeParams.coverage_score,
					'sum_insured_score': $routeParams.sum_insured_score,
					'estimate_money': $routeParams.estimate_money,
					'sum_score': $routeParams.sum_score
				});
			} else {
				$location.path('/tb_dz').search({
					'type': $routeParams.type,
					'coverage_score': $routeParams.coverage_score,
					'sum_insured_score': $routeParams.sum_insured_score,
					'estimate_money': $routeParams.estimate_money,
					'sum_score': $routeParams.sum_score,
					'from': 'dingzhi'
				});
			}
		}
		var isHaveRestrictions = false;

		$scope.init = function() {
			$scope.data = {};
			$scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_recommend_coverages'], {
				"insurance_type": $routeParams.type,
				"coverage_score": $routeParams.coverage_score,
				"sum_insured_score": $routeParams.sum_insured_score
			}, function(res) {
				if (res && res.data && res.data.data) {
					//$scope.data = res.data.data;
					$scope.data.main_coverages = res.data.data.coverages.filter(function(item) {
						return item.coverage_type == 1;
					});
					$scope.data.second_coverages = res.data.data.coverages.filter(function(item) {
						return item.coverage_type == 2;
					});
				}
			})
			$scope.restrictionPromise = getHttpPromise($http, $rootScope, 'POST', api['get_restrictions'], {
				"insurance_type": $routeParams.type,
				"coverage_score": $routeParams.coverage_score,
				"sum_insured_score": $routeParams.sum_insured_score
			}, function(res) {
				if (res.data.data) {
					if (res.data.data.age_notice || res.data.data.locale_notice || res.data.data.notices) {
						isHaveRestrictions = true;
					}
				}
			})
		}
	}
]);


mainControllers.controller('ybwxEducationCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {


		_hmt.push(['_trackPageview', $location.path()]);

		$scope.processMoney = function(money) {
			return util.processSpecialMoney(money);
		}
		$scope.goBdList = function() {
			$location.path('/bd_list');
		}
		$scope.isHaveUserInfo = false;
		$scope.getUserInfo = function() {
			var openId = sessionStorage.getItem("openId");
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'GET', api['get_user_info'].replace('{openId}', openId), {}, function(res) {
				console.log(res.data.data);
				if (res.data.data.age && res.data.data.gender) {
					$scope.isHaveUserInfo = true;
				}
			})
		}
		$scope.init = function() {
			var type = $routeParams.type;
			$scope.type = type;
			$scope.getUserInfo();
			var openId = sessionStorage.getItem("openId");
			$scope.myPromise = $http({
				method: 'GET',
				headers: {
					"Content-Type": "application/json;charset:UTF-8"
				},
				url: api['get_score_analysis'].replace("{openId}", openId).replace('{type}', type)

			}).then(function(res) {
				console.log(res);
				if (res && res.data && res.data.data) {
					$scope.data = res.data.data;
				}
			}, function(res) {
				console.log(res);
				util.showToast($rootScope, "服务器错误");
			});
		}
		$scope.goDingzhi = function() {
			_hmt.push(['_trackEvent', 'eduction', 'eduction_subBtn']);
			if ($scope.isHaveUserInfo) {
				$location.path('/select').search({
					'type': $routeParams.type
				});
			} else {
				$location.path('/userinfo').search({
					'type': $routeParams.type
				});
			}

		}
	}
]);

mainControllers.controller('ybwxEdIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		localStorage.setItem("isVisited", 1);
		_hmt.push(['_trackPageview', $location.path()]);
	}
]);
mainControllers.controller('ybwxContinueCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		//localStorage.setItem("isVisited",1);
		_hmt.push(['_trackPageview', $location.path()]);
	}
]);


function getUserInfo() {
	var userinfo = JSON.parse(localStorage.getItem('userinfo'));
	if (userinfo) {
		return {
			username: userinfo.username,
			social_id: userinfo.social_id,
			mobile: userinfo.mobile
		}
	} else {
		return {};
	}
}

function saveUserInfo(username, social_id, mobile) {
	localStorage.setItem('userinfo',
		JSON.stringify({
			username: username,
			social_id: social_id,
			mobile: mobile
		}));
}

function getFamily() {
	var familyInfo = JSON.parse(localStorage.getItem('familyInfo'));
	if (familyInfo) {
		return familyInfo;
	} else {
		return [];
	}
}


function saveFamily(familys) {
	localStorage.setItem('familyInfo', JSON.stringify(familys));
}

var periodTypeMap = {
	1: "d",
	2: "y"
}


mainControllers.controller('ybwxOfficalSiteCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		$scope.plans = JSON.parse(sessionStorage.getItem("sell_plan"));
		console.log($scope.plans);

		$scope.process_insured_money = function(str) {
			return util.processSpecialMoney(str);
		}

	}
]);



mainControllers.controller('ybwxToubaoDingzhiAllCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $filter, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path() + '_' + $routeParams.from]);

		$scope.genDanwei = function(type) {
			return coveragePeriodMap[type];
		}
		$scope.setTbFor = function(code) {
			$scope.tbFor = code;
			if (code === '1') {
				//为自己
				$scope.insured["username"] = $scope.user.username;
				$scope.insured["social_id"] = $scope.user.social_id;
				$scope.insured["mobile"] = $scope.user.mobile;
			} else {
				//为他人
				$scope.insured["username"] = "";
				$scope.insured["social_id"] = "";
				$scope.insured["mobile"] = "";
			}
			_hmt.push(['_trackEvent', 'toubao', 'toubao_setFor_' + code]);
		}
		$scope.showJobFirst = function() {
			_hmt.push(['_trackEvent', 'toubao', 'toubao_job_showPop']);
			$(".main").hide();
			$("#job_container_1").show();
		}
		$scope.showJobSecond = function(id) {
			_hmt.push(['_trackEvent', 'toubao', 'toubao_job_firstSelect']);
			$(".job_main").hide();
			$("#job_container_2").show();
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'GET', api['get_industries_2'] + id, {}, function(res) {
				console.log(res.data.data);
				$scope.data.occupations = res.data.data.occupations;
			})
		}

		/*
		$scope.checkJob = function() {
			if (!$scope.isJobOk) {
				util.showToast($rootScope, "您的职业不能投保该产品!!");
			}
			return $scope.isJobOk;
		}
		$scope.yesJob = function() {
			$(".main").show();
			$(".job_main").hide();
			$scope.isJobOk = false;
			$scope.checkJob();
		}
		$scope.noJob = function() {
			//$scope.isJobOk = true;
			$(".main").show();
			$(".job_main").hide();
		}*/
		$scope.confirmJob = function(job) {
			_hmt.push(['_trackEvent', 'toubao', 'toubao_job_thirdSelect']);
			$scope.job = job;
			$(".main").show();
			$(".job_main").hide();
		}
		$scope.showJobThird = function(id, name) {
			_hmt.push(['_trackEvent', 'toubao', 'toubao_job_secondSelect']);
			$(".job_main").hide();
			$("#job_container_3").show();
			$scope.job = name;
			$scope.thirdPromise = getHttpPromise($http, $rootScope, 'GET', api['get_industries_3'] + id, {}, function(res) {
				console.log(res.data.data);
				$scope.data.jobs = res.data.data.jobs;
				/*
				$scope.data.jobsArray = new Array();
				var jobs;
				if (res.data.data.jobs) {
					jobs = new Array();
					for (var i = 0; i < res.data.data.jobs.length; i++) {
						jobs.push(res.data.data.jobs[i]);
						if ((i + 1) % 2 == 0) {
							$scope.data.jobsArray.push(jobs);
							jobs = new Array();
						}
					}
				}
				if (jobs && jobs.length > 0) {
					$scope.data.jobsArray.push(jobs);
				}
				console.log($scope.data.jobsArray);
				*/
			})
		}
		$scope.checkUserInfo = function() {

			if ($scope.user.username && $scope.user.mobile && $scope.user.social_id) {
				$scope.isHaveInfo = true;
			} else {
				$scope.isHaveInfo = false;
			}

			console.log($scope.user);
			console.log("have Info:" + $scope.isHaveInfo);
		}
		$scope.choose = function($event) {
			_hmt.push(['_trackEvent', 'toubao', 'toubao_family_choose']);
			$($event.target).parents("tr").find("input").prop("checked", true);
			$("#family_container").find("tr").find("td:eq(4)").removeClass("hover");
			$($event.target).parents("tr").find("td:eq(4)").addClass("hover");
		}

		function selectDefaultFamily() {
			$("#family_container").find("tr:eq(0)").find("input").prop("checked", true);
			$("#family_container").find("tr:eq(0)").find("td:eq(4)").addClass("hover");
		}
		$scope.deleteFamily = function($event) {
			_hmt.push(['_trackEvent', 'toubao', 'toubao_family_delete']);
			var element = $($event.target).parents("tr");
			var name = $(element).find("td:eq(1)").html();
			element.remove();
			$scope.familys = $scope.familys.filter(function(item) {
				return item.name !== name;
			})
			//deleteFamily(name);
			selectDefaultFamily();
		}
		$scope.selectFamily = function() {
			_hmt.push(['_trackEvent', 'toubao', 'toubao_family_subBtn']);


			var username = $("#family_container").find('input[name=family_radio]:checked').parents("tr").find("td:eq(1)").html();
			var family = $scope.familys.filter(function(item) {
				return item.username === username;
			})
			console.log("select family......");
			console.log(username);
			console.log(family);

			$scope.insured["username"] = family[0]["username"];
			$scope.insured["relation"] = family[0]["relation"];
			$scope.insured["social_id"] = family[0]["social_id"];
			$scope.insured["mobile"] = family[0]["mobile"];
			$("#family_container").hide();
			$(".main").show();
			console.log("insured...");
			console.log($scope.insured);
			$scope.getPlans();
		}
		$scope.showFamily = function() {
			_hmt.push(['_trackEvent', 'toubao', 'toubao_family_showPopup']);
			selectDefaultFamily();
			$("#family_container").show();
			$(".main").hide();

		}
		$scope.init = function() {
			$scope.data = {};
			$scope.insured = {};
			$scope.premium = 0;
			$scope.job = {
				name: "请选择职业"
			};
			$scope.isJobOk = true;
			$scope.firstPromise = getHttpPromise($http, $rootScope, 'GET', api['get_industries_1'], {}, function(res) {
				console.log(res.data.data);
				$scope.data.industries = res.data.data.industries;
			});
			if ($routeParams.coverage_period_type) {
				$scope.coverage_period_type = $routeParams.coverage_period_type;
			}
			if ($routeParams.coverage_period) {
				$scope.coverage_period = $routeParams.coverage_period;
			}
			if ($routeParams.charge_period_type) {
				$scope.charge_period_type = $routeParams.charge_period_type;
			}
			if ($routeParams.charge_period) {
				$scope.charge_period = $routeParams.charge_period;
			}


			$scope.user = getUserInfo();
			$scope.familys = getFamily();
			$scope.premium = 0;
			console.log("family:......");
			console.log($scope.familys);
			$scope.checkUserInfo();
			$scope.setTbFor('1');
			$scope.getPlans(true); //获得投保方案的信息
			$scope.params = $routeParams;
			var effectiveDate = new Date();
			effectiveDate.setDate(effectiveDate.getDate() + 1);
			$scope.minDate = effectiveDate;
			$scope.user.effective_date = effectiveDate;
			$scope.know_contract = true;

			genInEffectiveDate();

		}

		function addDays(date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		}

		function genInEffectiveDate() {
			//计算失效日期
			if ($scope.coverage_period && $scope.coverage_period_type) {
				var period = $scope.coverage_period;
				var effDate = new Date();
				if ($scope.coverage_period_type == 5) {
					//					effDate.setDate($scope.user.effective_date.getDate() + parseInt($scope.coverage_period));
					effDate = addDays($scope.user.effective_date, parseInt($scope.coverage_period));
				}
				if ($scope.coverage_period_type == 2) {
					//var curr_year = $scope.user.effective_date.getFullYear();
					//effDate.setFullYear(curr_year + parseInt($scope.coverage_period));
					//effDate.setDate($scope.user.effective_date.getDate() + 365*parseInt($scope.coverage_period));
					effDate = addDays($scope.user.effective_date, 365 * parseInt($scope.coverage_period));
				}
				if ($scope.order && $scope.order.effective_date && !$scope.order.effective_date.$invalid) {
					$scope.user.inEffective_date = effDate;
				}
				if (!$scope.order) {
					$scope.user.inEffective_date = effDate;
				}
				/*
				console.log("$scope.order.effective_date.$invalid:"+$scope.order.effective_date.$invalid);
				console.log("inEffective_date:"+$scope.user.inEffective_date);*/
			}
		}
		$scope.changeEffectiveDate = function() {
			//选择保险期间
			genInEffectiveDate();
		}

		$scope.process_insured_money = function(str) {
			return util.processSpecialMoney(str);
		}

		$scope.getPlans = function() {

			$scope.sumPremium = 0;
			var openId = sessionStorage.getItem("openId");
			var postData = {
				open_id: openId
			};
			if ($scope.insured.social_id) {
				postData["social_id"] = $scope.insured.social_id;
			}
			/*
			if (isSocial) {
				if ($scope.order) {
					if (!$scope.order.social_id.$invalid) {//如果身份证正确，则包含身份证
						postData["social_id"] = $scope.insured.social_id;
					} else {
						return;
					}
				} else {

					if ($scope.insured.social_id) {
						postData["social_id"] = $scope.insured.social_id;
					} else {
						return;
					}

				}

			}*/

			if ($routeParams.type) {
				postData["insurance_type"] = $routeParams.type;
			}
			if ($routeParams.coverage_score) {
				postData["coverage_score"] = $routeParams.coverage_score;
			}
			if ($routeParams.sum_insured_score) {
				postData["sum_insured_score"] = $routeParams.sum_insured_score;
			}
			if ($routeParams.plan_id) {
				postData["plan_id"] = $routeParams.plan_id;
			}
			if ($routeParams.coverage_period) {
				postData["coverage_period"] = $routeParams.coverage_period;
			}
			if ($routeParams.coverage_period_type) {
				postData["coverage_period_type"] = $routeParams.coverage_period_type;
			}
			if ($routeParams.charge_period) {
				postData["charge_period"] = $routeParams.charge_period;
			}
			if ($routeParams.charge_period_type) {
				postData["charge_period_type"] = $routeParams.charge_period_type;
			}

			$scope.planPromise = getHttpPromise($http, $rootScope, 'POST', api['pre_insure'], postData, function(res) {



				console.log("pre_insure...");
				console.log(res.data.data);
				$scope.plans = res.data.data.plans;
				if (res.data.data.premium) {
					$scope.premium = res.data.data.premium;
				}

				$scope.isAllOffical = $scope.plans.every(function(item) {
					return item.status === 2;
				});

				console.log("isAllOffical:" + $scope.isAllOffical);


				$scope.view = res.data.data.view;

				sessionStorage.setItem("sell_plan", JSON.stringify($scope.plans));

				if (!$scope.relations) {
					//$scope.insured.relation = $scope.relations[0];
					if (res.data.data.relations) {
						$scope.relations = res.data.data.relations;
						var obj = {
							id: '-1',
							name: '请选择关系'
						};
						$scope.relations.unshift(obj);
						$scope.insured.relation = obj;
					}

				}
				if (res.data.data.min_effective_days) {
					var minDate = new Date();
					minDate.setDate(minDate.getDate() + res.data.data.min_effective_days);
					$scope.minDate = minDate;
					$scope.user.effective_date = minDate;
				}
				if (res.data.data.max_effective_days) {
					var maxDate = new Date();
					maxDate.setDate(maxDate.getDate() + res.data.data.max_effective_days);
					$scope.maxDate = maxDate;
				}

				if (res.data.data.coverage_period && res.data.data.coverage_period.indexOf("|") < 0) {
					$scope.coverage_period = res.data.data.coverage_period;
					$scope.coverage_period_type = res.data.data.coverage_period_type;
					$scope.charge_period_type = res.data.data.charge_period_type;
					genInEffectiveDate();
				}
				if (!$scope.view.family) {

					/*
					$("#select_toubao").find(".cell_hd:eq(0)").css({
						"padding-right": 0
					});
					$("#select_toubao").find(".cell_hd:eq(1)").hide();
					*/
				}

			});

		}

		function baseValid() {
			if ($scope.order.username.$invalid) {
				util.showToast($rootScope, "姓名不正确");
				return false;
			}
			if ($scope.view.family && $scope.tbFor === '2') {
				if ($scope.insured && $scope.insured.relation && $scope.insured.relation.id === "-1") {
					util.showToast($rootScope, "请选择被保人与您的关系");
					return false;
				}
			}
			if ($scope.order.social_id.$invalid) {
				util.showToast($rootScope, "身份证号不正确");
				return false;
			}
			if ($scope.order.mobile.$invalid) {
				util.showToast($rootScope, "手机号不正确");
				return false;
			}

			if ($scope.order.effective_date.$invalid) {
				util.showToast($rootScope, "保险生效时间不正确");
				return false;
			}

			if ($scope.view.job) {
				if (!$scope.job || !$scope.job.id) {
					util.showToast($rootScope, "请选择您工作的行业");
					return false;
				}
			}

			if ($scope.view.email && $scope.order.email.$invalid) {
				util.showToast($rootScope, "Email填写不正确");
				return false;
			}
			if ($scope.view.address && $scope.order.address.$invalid) {
				util.showToast($rootScope, " 地址填写不正确");
				return false;
			}

			if ($scope.view.car_no && $scope.order.car_no.$invalid) {
				util.showToast($rootScope, "车牌号不正确");
				return false;
			}
			//console.log("$scope.know_contract:"+$scope.know_contract);
			if (!$scope.know_contract) {
				util.showToast($rootScope, "请确认阅读《平台服务协议》和保险条款");
				return false;
			}
			return true;
		}



		function familyValid() {
			if ($scope.userForm.username.$invalid) {
				util.showToast($rootScope, "姓名不正确");
				return false;
			}
			if ($scope.userForm.social_id.$invalid) {
				util.showToast($rootScope, "身份证不正确");
				return false;
			}
			if ($scope.userForm.mobile.$invalid) {
				util.showToast($rootScope, "手机号不正确");
				return false;
			}

			return true;
		}

		function getResponse(res) {
			return {
				"insurance_name": res.data.data.insurance_name,
				"insurance_plan_name": res.data.data.insurance_plan_name,
				"order_amount": res.data.data.order_amount,
				//"order_amount": 10,
				"order_id": res.data.data.order_id,
				"order_no": res.data.data.order_no
			}
		}
		var taocan_status = {
			1: "",
			2: "未开售",
			3: "已购买",
			4: "已购买",
			5: "已购买"

		}
		var taocan_css = {
			1: "tb",
			2: "unsell",
			3: "unsell",
			4: "unsell",
			5: "unsell"
		}

		$scope.get_taocan_css = function(status) {
			return taocan_css[status];
		}

		$scope.taocan_status = function(status) {
			return taocan_status[status];
		}

		$scope.submitbt = function(type) {

			if ($scope.isAllOffical) {
				$location.path("/offical");
				return;
			}

			_hmt.push(['_trackEvent', 'toubao', 'toubao_subBtn_' + $routeParams.from]);
			var openId = sessionStorage.getItem("openId");
			$scope.checkUserInfo();
			//var dataFor = $("#select_toubao").find(".btn_n_primary").attr("data-for") == "self" ? 1 : 2;
			console.log("user:");
			console.log($scope.user);
			var effectiveDate = $filter('date')($scope.user.effective_date, "yyyyMMdd");
			var ineffectiveDate = $filter('date')($scope.user.inEffective_date, "yyyyMMdd");
			var plans_to_premium = {};
			if (!$scope.plans) {
				$scope.getPlans();
				return;
			}
			$scope.plans.forEach(function(element, index) {
				if (element.status === 1) { //状态为1 保险套餐开售才可以购买
					plans_to_premium[element.id] = element.premium;
				}
			});
			if (Object.keys(plans_to_premium).length == 0) {
				util.showToast($rootScope, "很抱歉，超过保险公司的限制，无法投保");
				return false;
			}
			var postData = {
				open_id: openId,
				plans_to_premium: plans_to_premium,
				insure_type: $scope.tbFor,
				effective_date: effectiveDate,
				ineffective_date: ineffectiveDate,
				coverage_period: $scope.coverage_period,
				coverage_period_type: $scope.coverage_period_type,
				charge_period_type: $scope.charge_period_type
			};
			if ($scope.view.job && $scope.job) {
				postData["job_id"] = $scope.job.id;
			}
			if ($scope.view.email && $scope.insured.email) {
				postData["email"] = $scope.insured.email;
			}
			if ($scope.view.address && $scope.insured.address) {
				postData["address"] = $scope.insured.address;
			}
			if ($scope.charge_period) {
				postData["charge_period"] = $scope.charge_period;
			}
			var isValid = false;

			if (baseValid()) {


				if ($scope.tbFor == '1') {
					//为自己
					postData["name"] = $scope.insured.username;
					postData["social_id"] = $scope.insured.social_id;
					postData["mobile"] = $scope.insured.mobile;
					isValid = true;

				} else {
					//为家人
					if (type == "userForm" && !familyValid()) {
						return false;
					}
					if ($scope.isHaveInfo) { //有投保人信息
						postData["name"] = $scope.user.username;
						postData["social_id"] = $scope.user.social_id;
						postData["mobile"] = $scope.user.mobile;
						postData["insured_peoples"] = [{
							"name": $scope.insured.username,
							"mobile": $scope.insured.mobile,
							"social_id": $scope.insured.social_id,
							"relation": $scope.insured.relation.value
						}];
						isValid = true;
					} else { //没有投保人信息
						$(".main").hide();
						$("#self_container").show();
					}

				}
			}

			if (isValid) {


				getHttpPromise($http, $rootScope, 'POST', api['insure'], postData, function(res) {
					saveUserInfo(postData["name"], postData["social_id"], postData["mobile"]);
					if (postData["insured_peoples"]) {
						var familys = $scope.familys.filter(function(item) {
							return item.username !== postData["insured_peoples"][0]["name"];
						});
						familys.push({
							username: postData["insured_peoples"][0].name,
							social_id: postData["insured_peoples"][0].social_id,
							relation: $scope.insured.relation,
							mobile: postData["insured_peoples"][0].mobile
						});
						saveFamily(familys);
					}
					var payResponse = getResponse(res);
					/*
					if (whiteOpenIds.indexOf(openId)!==-1) {
						payResponse["order_amount"] = 10;
					}*/

					$location.path("/pay_select").search(payResponse);
				});
			}
		}
	}
]);
var whiteOpenIds = ["omP9dwb6u-lamgwOhFqFIcU3QLPk", "omP9dwbQiEkPbFE0K6NtVa4d5bF0", "omP9dwThw9op485Y-6NMp6HywJ0M", "omP9dwSdKKzWA4D9j1I1Lr1EbHMg"];