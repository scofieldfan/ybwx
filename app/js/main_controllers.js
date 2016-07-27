'use strict';

/* Controllers */

var mainControllers = angular.module('mainControllers', []);

var api = {
	'get_insurances': '/ybwx-web/api/insurance_orders',
	'get_insurance_detail': '/ybwx-web/api/insurance_order',
	'get_insurance_index': '/ybwx-web/api/aggregate_score',
	'get_insurances_selling': '/ybwx-web/api/insurance/selling',
	'get_insurance_category': '/ybwx-web/api/insurance/insurance_category',
	'get_insurance_category_insurance': '/ybwx-web/api/insurance/insurance_category_insurance',
	'get_insurances_detail': '/ybwx-web/api/insurance/plans',
	'get_insurances_mask': '/ybwx-web/api/insurance/float/{productId}',
	'get_insurances_sex': 'ybwx-web/api/insurance/premium',
	'get_recommend': '/ybwx-web/api/recommend_view/{type}',
	'get_recommend_coverages': '/ybwx-web/api/recommend_coverages',
	'get_recommend_plans': '/ybwx-web/api/recommend_plans',
	'get_estimate_money': '/ybwx-web/api/recommend_premium',
	'get_recommend_suggestion': '/ybwx-web/api/recommend/suggestion',
	// 'get_restrictions': '/ybwx-web/api/recommend_restrictions',
	'get_restrictions': '/ybwx-web/api/insurance/notice',
	'get_score_analysis_new': '/ybwx-web/api/single_score/{openId}/{type}',
	'get_score_analysis': '/ybwx-web/api/score_analysis/{openId}/{type}',
	'get_industries_1': '/ybwx-web/api/industries',
	'get_industries_2': '/ybwx-web/api/occupations/',
	'get_industries_3': '/ybwx-web/api/jobs/',
	'pre_insure': '/ybwx-web/api/insurance/pre_insure',
	'prepare_insure': '/ybwx-web/api/insurance/prepare',
	'insure': '/ybwx-web/api/insurance/insure',
	'send_bd': '/ybwx-web/api/send_policy',
	'pay': '/ybwx-web/api/pay',
	'pay_new': '/ybwx-web/api/insurance/pay',
	'get_user_info': '/ybwx-web/user/info/wechat/{openId}',
	'set_user_info': '/ybwx-web/user/info/update',
	'upload_policy_image': '/ybwx-web/api/upload_policy_image',
	'get_policies_list': '/ybwx-web/api/policies',
	'get_policy_detail': '/ybwx-web/api/policy',
	'signature': '/ybwx-diplomat/wechat/js_signature',
	'get_claim_info': '/ybwx-web/api/claim_info/{id}',
	'get_verfiy_policy': '/ybwx-web/api/policies/verify',
	'policy_verfiy': '/ybwx-web/api/verify',
	'get_policy_verfiyinfo': '/ybwx-web/api/verify_info/{id}',
	'temai_index': '/ybwx-web/api/insurance/selling_page',
	'get_recommend_plans': '/ybwx-web/api/recommend/plans',
	'firstToubao': '/ybwx-web/api/relation/first',
	'recognizee_compile': '/ybwx-web/api/relations',
	'getData': '/ybwx-web/api/relation',
	'addContact': '/ybwx-web/api/relation/add',
	'deleteContact': '/ybwx-web/api/relation/delete',
	'update': '/ybwx-web/api/relation/update',
	'purchase': '/ybwx-web/api/insurance/purchase',
	'get_sum_insured': '/ybwx-web/api/insurance/get_sum_insured'
}

var isNew = true;

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

//套餐状态
(0, "套餐不可购买")
(1, "套餐可购买")
(2, "套餐未开售")
(3, "保险产品份数超过限制")
(4, "保险套餐份数超过限制")
(5, "保额超过限制")
(6, "投保人年龄超过限制")
(7, "被保人年龄超过限制")
(8, "被保人性别超过限制")
(9, "被保人关系在此产品不能投保")        
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

	var openId = sessionStorage.getItem("openId");
	if (!data["open_id"]) {
		data["open_id"] = openId;
	}
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
		util.showToast($rootScope, "网络异常");
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



function initPieConfig(sumScore, scores, policyNumber) {
	var pieConfig = [

		{
			"text": "意外",
			"percent": scores[4] / 10,
			"icon": "\uf21e",
			"img": "img/index/plane.png",
			"isDisable": true,
			"color": "#ffd9df",
			"textColor": "#ff788e",
			"hoverColor": "#fffafa"
		}, {
			"text": "人寿",
			"percent": scores[3] / 10,
			"icon": "\uf155",
			"img": "img/index/heart.png",
			"isDisable": true,
			"color": "#c6f9e7",
			"textColor": "#54dbaa",
			"hoverColor": "#fffefa"
		}, {
			"text": "健康",
			"percent": scores[2] / 10,
			"isDisable": true,
			"icon": "\uf1b9",
			"img": "img/index/health.png",
			"color": "#cbe9ff",
			"textColor": "#4aa7e9",
			"hoverColor": "#fafffc"
		}, {
			"text": "家庭",
			"percent": scores[1] / 10,
			"isDisable": false,
			"icon": "\uf072",
			"img": "img/index/family.png",
			"color": "#f3e1ff",
			"textColor": "#ca94ee",
			"hoverColor": "#fbfdff"
		}, {
			"text": "财产",
			"percent": scores[5] / 10,
			"icon": "\uf278",
			"img": "img/index/money.png",
			"isDisable": true,
			"color": "#f0ead9",
			"textColor": "#cdc48b",
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
mainControllers.controller('ybwxPromoteCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);
		$scope.goSelect = function(type) {
			window.location = ("#/select?type=" + type);
		}
		$scope.goContinue = function() {
			$location.path('/continue');
		}
	}
])
mainControllers.controller('ybwxIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		//isNew = sessionStorage.getItem("isNew");
		//isNew = true;
		$scope.data = {
			aggregate_score: 0
		}
		$('#gift').click(function() {
			$("#share_ctrl").show();
		});
		$("body").on("click", "#share_ctrl", function() {
			$("#share_ctrl").hide();
		}).on("click", "#opacity_ctrl", function() {
			$("#share_ctrl").hide();
		})
		$scope.showTip = function() {
			_hmt.push(['_trackEvent', 'index', 'index_showTip']);
			// $("#share").show();
			$location.path("/promote").search();
		}
		$scope.goBdMange = function() {
			_hmt.push(['_trackEvent', 'index', 'index_baodan_guanli']);
			$location.path('/bdm_list').search();
		}
		$scope.goPromote = function() {
			$location.path('/promote').search();
		}
		var cellClass = ".cell-footer";
		$scope.goIndex = function($event) {
			//$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
			//$($event.target).parents(cellClass).addClass("hover");
		}
		$scope.goTemai = function($event) {
			//$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
			//$($event.target).parents(cellClass).addClass("hover");
			$location.path('/temaiindex').search();
		}
		$scope.goService = function($event) {
			//$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
			//$($event.target).parents(cellClass).addClass("hover");
			$location.path('/service').search();
		}
		$scope.init = function() {
			//获得openId
			//setTest($routeParams.is_test);
			var currentUrl = "http://web.youbaowuxian.com/#/index";
			util.checkCodeAndOpenId($routeParams.code, currentUrl, function() {

				util.share();
				/*
					判断是否第一次进入
				*/
				var isFirstTime = localStorage.getItem("isVisited");
				if (!isFirstTime) {
					$location.path('/edindex');
				}
				var openId = sessionStorage.getItem("openId");
				$scope.secondPromise = getHttpPromise($http, $rootScope, 'GET', api['get_insurance_index'] + "/" + openId, {}, function(res) {

					if (res.data && res.data.description) {
						util.showToast($rootScope, res.data.description);
					}
					if (res.data.code == 0) {
						$("#loadingContainer").hide();
						$scope.data = res.data.data;
						initPieConfig($scope.data.aggregate_score, $scope.data.scores, $scope.data.policy);
					}
				})

			});
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
		//sum_score = Math.floor((scoreObj.fanweiScore + scoreObj.moneyScore) / 2);
		//sum_score = Math.floor((scoreObj.fanweiScore * scoreObj.moneyScore) / 10);
		sum_score = Math.floor(scoreObj.fanweiScore);
	}
	//$("#sum_score").html(sum_score);
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


mainControllers.controller('ybwxBdEducationNewCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);


		$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {

			$('input[type="range"]').rangeslider({
				polyfill: false,
				rangeClass: 'rangeslider',
				disabledClass: 'rangeslider--disabled',
				verticalClass: 'rangeslider--vertical',
				fillClass: 'rangeslider__fill',
				handleClass: 'rangeslider__handle',
			});

		});

		$scope.more = function($event) {
			var element = $event.currentTarget;
			var switchValue = $(element).attr("data-switch");
			if (switchValue === 'on') {
				$(element).siblings(".table-wrapper").find("tr").removeClass("ng-hide");
				$(element).find("span").html("收起");
				$(element).attr("data-switch", "off");
				$(element).find("div").addClass("up");
			} else {
				$(element).siblings(".table-wrapper").find("tr:gt(6)").addClass("ng-hide");
				$(element).find("span").html("查看更多");
				$(element).attr("data-switch", "on");
				$(element).find("div").removeClass("up");
			}
		}
		$scope.processMoney = function(money) {
			if (money == 0) {
				return "已投保";
			} else {
				return util.processSpecialMoney(money);
			}
		}
		$scope.getInsuranceCNname = function() {
			return insureanceCNMap[$routeParams.type];
		}

		$scope.goOldEducation = function() {
			$location.path('/education').search({
				"type": $routeParams.type
			});
			_hmt.push(['_trackEvent', 'bd_education', 'bdEducation_goEducation']);
		}

		$scope.goUpBd = function() {
			_hmt.push(['_trackEvent', 'bd_education', 'bdEducation_goBdIndex']);
			$location.path('/bd_index');
		}

		$scope.goBdmList = function() {
			_hmt.push(['_trackEvent', 'bd_education', 'bdEducation_goBdmList']);
			$location.path('/bdm_list').search({
				"type": $routeParams.type
			});
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

			var code = util.getParameterByName("code") || $routeParams.code;

			util.getOpenId(code).then(function() {
				var type = $routeParams.type;
				$scope.type = $routeParams.type;
				$scope.getUserInfo();
				var openId = sessionStorage.getItem("openId");
				$scope.educationPromise = getHttpPromise($http, $rootScope, 'GET', api['get_score_analysis_new'].replace('{openId}', openId).replace('{type}', type), {}, function(res) {
					if (res && res.data && res.data.data) {
						res.data.data.score = Math.round(res.data.data.score * 10) / 10;
						$scope.data = res.data.data;
					}
				})
			});
		}
		$scope.goDingzhi = function() {
			_hmt.push(['_trackEvent', 'bd_education', 'bdEducation_goDingZhi']);
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


mainControllers.controller('ybwxSelectCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);
		$scope.init = function() {
			CIRCLE.init();
			$scope.type = $routeParams.type;
			$scope.estimateMoney = 0;

			var openId = sessionStorage.getItem("openId");
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'GET', api['get_recommend'].replace('{type}', $routeParams.type), {}, function(res) {

				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
				}
				if (res.data.code == 0) {
					var sumInsuredView = [];

					_.map(res.data.data.sum_insured_views, function(value, key) {
						var objKey = _.groupBy(value, function(val, index) {
							return index % 2;
						});
						//后台只留偶数部分，找巴哥咨询
						sumInsuredView[key] = objKey[1];
					});
					CIRCLE.updateData(res.data.data.coverage_scores, res.data.data.coverage_views, sumInsuredView, $routeParams.type);
				}
			});

		}
		$scope.data = {
			scoreFix: 0
		}
		var openId = sessionStorage.getItem("openId");
		//get_recommend_suggestion
		$scope.goEstimateMoney = function() {
			if (scoreObj.fanweiScore == 0 || scoreObj.moneyScore == 0) {
				//$scope.estimateMoney = 0;
				$scope.$apply();
			} else {

				$scope.moneyPromise = getHttpPromise($http, $rootScope, 'POST', api['get_recommend_suggestion'], {
					"open_id": openId,
					"insurance_type": $routeParams.type, // 保险类型
					"coverage_score": scoreObj.fanweiScore, // 保障分
					"sum_insured_score": scoreObj.moneyScore // 保额分
				}, function(res) {
					console.log(res);
					if (res && res.data && res.data.data) {
						if (res.data.data.score > 0) {
							res.data.data.scoreFix = Math.round(res.data.data.score * 10) / 10;
						}
						$scope.data = res.data.data;

					}
				})
			}
		}
		$scope.getSumScore = function(incomeType) {
			$scope.sumScorePromise = getHttpPromise($http, $rootScope, 'POST', api['get_sum_insured'], {
				open_id: openId,
				income_type: incomeType,
				level: Math.round(scoreObj.moneyScore/2)
			}, function(res) {
				if (res && res.data && res.data.data) {
					

				}
			})
		}

		$scope.goBz = function() {
			_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_subBtn']);
			if (scoreObj.fanweiScore == 0 || scoreObj.moneyScore == 0) {
				util.showToast($rootScope, "请选择保障范围和保障额度");
				return false;
			}

			$location.path('/solution').search({
				'type': $routeParams.type,
				'coverage_score': scoreObj.fanweiScore,
				'sum_insured_score': scoreObj.moneyScore,
				'estimate_money': $scope.data.premium,
				'sum_score': $scope.data.scoreFix
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
			console.log("....go jingzhun....");
			_hmt.push(['_trackEvent', 'dingzhi', 'dingzhi_jingzhunBtn']);
			$location.path('/jingzhun').search({
				'type': $routeParams.type
			});
		}
		$scope.showIntellReckon = function() {
			$("#popup").show();
		}
		$scope.selectInsured = function($event,incomeType){
			var element = $event.currentTarget;	
			$(element).addClass("blue").siblings().removeClass("blue");
			$scope.getSumScore(incomeType);
		}
		$scope.close = function(){
			$("#popup").hide();
		}
		/*
		$("#details .income").click(function() {
			$(this).addClass("blue").siblings().removeClass("blue");
			$(this).html();
		});
		$("#off").click(function() {
			$("#popup").hide();
		});*/
	}
]);

mainControllers.controller('ybwxSolutionCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {


		_hmt.push(['_trackPageview', $location.path()]);
		$scope.money = $routeParams.estimate_money;
		$scope.type = $routeParams.type;
		//get_recommend_plans
		$scope.getCoverageType = util.getCoverageType;
		$scope.processSpecialMoney = util.processSpecialMoney;
		$scope.getTaoCanStatus = util.getTaoCanStatus;
		// $('#stopPro').css('-webkit-overflow-scrolling','auto');
		$scope.getInsuranceCNname = function() {
			return insureanceCNMap[$routeParams.type];
		}
		var taocan_css = {
			1: "",
			2: "unsell",
			3: "selled",
			4: "selled",
			5: "selled",
			6: "unsell",
			7: "unsell",
			8: "unsell",
			9: "unsell"
		}

		$scope.get_taocan_css = function(status) {
			return taocan_css[status];
		}

		$scope.go = function(plan) {

			if (plan.status === 1) {
				plan.unchecked = !plan.unchecked;
				$scope.choosePlan();
			}

		}
		$scope.goDetail = function(plan) {
			if (plan.status === 1) { //可购买跳转至产品详情页
				if (plan.insurance_status !== 1) {
					$location.path('/temaidetail').search({
						product_id: plan.insurance_id
					});
				}

			} else
			if (plan.official_site) {
				window.location.href = plan.official_site;
			}
		}

		$scope.more = function($event) {
			var element = $event.currentTarget;
			var switchValue = $(element).attr("data-switch");
			var num = $scope.showNum - 1;
			if (switchValue === 'on') {
				$(element).siblings(".table-wrapper").find("tr").show();
				$(element).find("span").html("收起");
				$(element).attr("data-switch", "off");
				$(element).find("div").addClass("up");
				_hmt.push(['_trackEvent', 'solution', 'solution_unfold']);
			} else {
				$(element).siblings(".table-wrapper").find("tr:gt(" + num + ")").hide();
				$(element).find("span").html("查看更多");
				$(element).attr("data-switch", "on");
				$(element).find("div").removeClass("up");
				_hmt.push(['_trackEvent', 'solution', 'solution_fold']);
			}
		}

		$scope.choosePlan = function() {
			_hmt.push(['_trackEvent', 'solution', 'solution_choose']);
			var filteredPlans = $scope.data.plans.filter(function(item) {
				return item.status === 1 && !item.unchecked;
			});
			var sumMoney = filteredPlans.map(function(item) {
				return item.premium;
			}).reduce(function(preVal, curVal, index, array) {
				return preVal + curVal;

			}, 0);
			$scope.choosePlansIds = filteredPlans.map(function(item) {
				return item.id;
			});
			$scope.sumMoney = sumMoney;
			var allMoney = $scope.data.plans.reduce(function(preVal, curVal, index, array) {
				return preVal + curVal.premium;
			}, 0);

			$scope.planAllMoney = allMoney;
			$scope.getRestrictions();

		}

		$scope.isHaveRestrictions = false;

		$scope.getRestrictions = function() {
			var openId = sessionStorage.getItem("openId");
			$scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_restrictions'], {
				open_id: openId,
				plan_ids: $scope.choosePlansIds

			}, function(res) {
				$scope.isHaveRestrictions = (res.data.data.job_notice && Object.keys(res.data.data.job_notice).length > 0) || res.data.data.locale_notice || res.data.data.notices.length > 0;
			})
		}
		$scope.init = function() {
			$scope.showNum = 4;
			$scope.sumMoney = 0;
			var openId = sessionStorage.getItem("openId");
			$scope.solutionPromise = getHttpPromise($http, $rootScope, 'POST', api['get_recommend_plans'], {
				"open_id": openId,
				"insurance_type": $routeParams.type,
				"coverage_score": $routeParams.coverage_score,
				"sum_insured_score": $routeParams.sum_insured_score
			}, function(res) {
				console.log(res);
				if (res && res.data && res.data.data) {
					$scope.data = res.data.data;

					$scope.data.mainCoverages = res.data.data.coverages.filter(function(item) {
						return item.coverage_type === 1;
					});
					$scope.data.secondCoverages = res.data.data.coverages.filter(function(item) {
						return item.coverage_type === 2;
					});

					//如果方案中所有的套餐都已购买或者为开售按钮变成灰色
					$scope.canNotBuyPlans = res.data.data.plans.filter(function(item) {
						return item.status !== 1; //过滤得到不能购买的产品
					});

					if (　$scope.canNotBuyPlans.length === res.data.data.plans.length) {
						$(".footer").find(".right").css({
							"background-color": "#999"
						})
					}
					$scope.choosePlan();
					$scope.getRestrictions();

				}
			});



		}
		$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
			$("#coverage_table").find("tr:lt(" + $scope.showNum + ")").show();
			if ($("#coverage_table").find("tr").length > $scope.showNum) {
				$("#more_button").show();
			}
		});
		$scope.showCoverages = function() {
			$("#coverage_table").find("tr:lt(" + $scope.showNum + ")").show();
			if ($("#coverage_table").find("tr").length > $scope.showNum) {
				$("#more_button").show();
			}
		}

		$scope.goInfo = function() {
			_hmt.push(['_trackEvent', 'solution', 'solution_subBtn']);


			if ($scope.canNotBuyPlans.length === $scope.data.plans.length) {
				util.showToast($rootScope, "方案中的产品全都不可购买，请至官方购买");
				return;
			}
			if ($scope.choosePlansIds.length == 0) {
				util.showToast($rootScope, "请选择开售的产品");
				return;

			}

			if ($scope.isHaveRestrictions) {
				$location.path('/information').search({
					'type': $routeParams.type,
					'coverage_score': $routeParams.coverage_score,
					'sum_insured_score': $routeParams.sum_insured_score,
					'sum_score': $routeParams.sum_score,
					'choose_plans': JSON.stringify($scope.choosePlansIds)
				});
			} else {
				$location.path('/toubao_new').search({
					'type': $routeParams.type,
					'choose_plans': JSON.stringify($scope.choosePlansIds)
				});
			}
		}

	}
]);



mainControllers.controller('ybwxJingzhunCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);

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
			$location.path("/temaidetail").search({
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
			util.showToast($rootScope, "很抱歉，被保险人不满足该产品投保规定。详情请联系诺贝：400-992-0205");
		}
		$scope.goToubao = function() {
			_hmt.push(['_trackEvent', 'information', 'information_subBtn']);
			$location.path('/toubao_new').search({
				'type': $routeParams.type,
				'choose_plans': $routeParams.choose_plans
			});
		};

		$scope.showJobDes = function(sencondJob, jobName) {

			var html = [];
			html.push(' <div class="job_name" >' + jobName + '</div>');
			sencondJob.forEach(function(item) {

				html.push(' <div class="toast_head" >' + item.name + '</div>');
				var des = [];
				item.jobs.forEach(function(element) {
					des.push(element.name);
				});

				html.push(' <div class="toast_main" >' + des.join(" 、") + '</div>');

			});
			$("#popup").find(".info_toast").html(html.join(""));
			$("#popup").show();
		}
		$scope.init = function() {

			var openId = sessionStorage.getItem("openId");
			$scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_restrictions'], {
				"open_id": openId,
				plan_ids: JSON.parse($routeParams.choose_plans),
			}, function(res) {
				console.log(res);
				$scope.data = res.data.data;
				if ($scope.data.notices) {
					$scope.data.notices = _.map($scope.data.notices, function(item) {
						if (item.health_notice) {
							item.healthNotices = item.health_notice.split("\r\n");
						}
						return item;
					});
					$scope.data.notices = _.map($scope.data.notices, function(item) {
						if (item.extra_notice) {
							item.extraNotices = item.extra_notice.split("\r\n");
						}
						return item;
					});
				}
				$scope.isHaveJob = Object.keys($scope.data.job_notice).length > 0;
				/*
				$scope.isHaveJob = _.filter($scope.data.job_notice, function(job_notice) {
					return job_notice
				})*/
				$scope.isHaveHealth = _.filter($scope.data.notices, function(notice) {
					return notice.health_notice
				}).length > 0;
				$scope.isExtraNotice = _.filter($scope.data.notices, function(notice) {
					return notice.extra_notice
				}).length > 0;
				// console.log("extranotice:" + $scope.isExtraNotice.length);

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

/*
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
}*/

var periodTypeMap = {
	1: "d",
	2: "y"
}



mainControllers.controller('ybwxSupplayInfoCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		$scope.for = 'self';
		$scope.relations = util.modifyRelationShip;
		$scope.data = {
			relation: {
				id: 2,
				name: '父亲'
			}
		};
		$scope.init = function() {

		}


		$scope.submit = function() {
			_hmt.push(['_trackEvent', 'supplyinfo', 'supplyinfo_submit']);
			var openId = sessionStorage.getItem("openId");
			if (baseValid()) {

				var postData = {
					'open_id': openId,
					"insured_username": $scope.insured_username,
					"insured_social_id": $scope.insured_social_id,
					"insured_mobile": $scope.insured_mobile,
					"relation": "1"
				};


				if ($scope.for === 'other') {
					postData["relation"] = $scope.data.relation.id;
					postData["username"] = $scope.username;
					postData["social_id"] = $scope.social_id;
					postData["mobile"] = $scope.mobile;
				}

				$scope.firstToubao = getHttpPromise($http, $rootScope, 'POST', api['firstToubao'], postData, function(res) {
					$location.path('/toubao_new').search({
						type: $routeParams.type,
						choose_plans: $routeParams.choose_plans,
						user_id: res.data.data.user.id
					});
				});
			}
		}


		function baseValid() {
			if (!$scope.userform) {
				util.showToast($rootScope, "表单错误");
				return false;
			}
			if ($scope.userform.insured_username.$invalid) {
				util.showToast($rootScope, "被保人姓名不正确");
				return false;
			}

			if ($scope.userform.insured_social_id.$invalid) {
				util.showToast($rootScope, "被保人身份证号不正确");
				return false;
			}
			if ($scope.userform.insured_mobile.$invalid) {
				util.showToast($rootScope, "被保人手机号不正确");
				return false;
			}
			if ($scope.for === 'other') {

				if ($scope.userform.username && $scope.userform.username.$invalid) {
					util.showToast($rootScope, "投保人姓名不正确");
					return false;
				}
				if ($scope.userform.social_id && $scope.userform.social_id.$invalid) {
					util.showToast($rootScope, "投保人身份证不正确");
					return false;
				}
				if ($scope.userform.mobile && $scope.userform.mobile.$invalid) {
					util.showToast($rootScope, "投保人手机号不正确");
					return false;
				}

			}

			return true;
		}
	}
]);

mainControllers.controller('ybwxToubaoNewCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope','sharedPlanIntrod',
	function($scope, $filter, $routeParams, $location, $http, $rootScope,sharedPlanIntrod) {
		//得兼容定制页投保，特卖投保
		_hmt.push(['_trackPageview', $location.path()]);

		var openId = sessionStorage.getItem("openId");
		$scope.getTaocanReason = function(reasonEnum) {
			return util.taocan_reason[reasonEnum] || "";
		}

		function genInEffectiveDate(startDate, coverage_period, coverage_period_type) {
			//计算失效日期
			//var startDate = $scope.user.effective_date;
			if (startDate && coverage_period && coverage_period_type) {
				var period = coverage_period;
				var effDate = new Date();
				if (coverage_period_type == 5) {
					effDate = util.addDays(startDate, parseInt(coverage_period));
				}
				if (coverage_period_type == 2) {
					effDate = util.addDays(startDate, 365 * parseInt(coverage_period));
				}
				return effDate;
			}
		}
		$scope.goTermsList = function() {
			$location.path("/terms_list").search();

		}
		$scope.genPlansInEffectiveDate = function() {
			$scope.data.plans.forEach(function(element, index) {
				var startDate;
				if (element.auto_effective_days) {
					startDate = util.addDays(new Date(), parseInt(element.auto_effective_days));
				} else {
					startDate = $scope.user.effective_date;
				}
				element.startDate = startDate;
				return element.endDate = genInEffectiveDate(startDate, element.coverage_period, element.coverage_period_type);
			});
			console.log($scope.data.plans);
		}
		$scope.goRoute = function() {
			_hmt.push(['_trackEvent', 'toubaonew', 'toubaonew_toubaoren']);
			if ($scope.isFirst) {
				//去补充信息页
				$location.path('/supply_userinfo').search($routeParams);
			} else {
				//去list页	
				$location.path('/contact_list').search($routeParams);
			}
		}

		$scope.submit = function() {
			_hmt.push(['_trackEvent', 'toubaonew', 'toubaonew_submit']);

			if (!$scope.tbform.$invalid && $scope.canNotBuyPlans.length < $scope.data.plans.length) {
				var plans = {};
				$scope.data.plans.forEach(function(element, index) {
					if (element.status === 1) {
						plans[element.id] = element.premium;
					}
				});

				var effectiveDate = $filter('date')($scope.user.effective_date, "yyyyMMdd");

				$scope.submitPromise = getHttpPromise($http, $rootScope, 'POST', api['purchase'], {
					'open_id': openId,
					"insured_id": $scope.data.insured.id,
					'plans': plans,
					'coverage_period': $scope.coverage_period,
					'charge_period': $scope.charge_period,
					'effective_date': effectiveDate,
					'address': $scope.address,
					'destination': $scope.destination,
					'car_no': $scope.car_no
				}, function(res) {

					var payRequest = {
						"insurance_name": res.data.data.insurance_name,
						"insurance_plan_name": res.data.data.insurance_plan_name,
						"order_amount": res.data.data.order_amount,
						"order_id": res.data.data.pay_order_id,
						"order_no": res.data.data.pay_order_no
					}
					$location.path("/pay_select").search(payRequest);

				});
			} else {
				console.log("error.......");
				console.log($scope.tbform);
				if ($scope.tbform.effectivedate && 　$scope.tbform.effectivedate.$invalid) {
					util.showToast($rootScope, "生效时间填写有误，请修改");
				}
				if ($scope.canNotBuyPlans.length > 0) {
					util.showToast($rootScope, $scope.getTaocanReason($scope.canNotBuyPlans[0].status));
				}

				if ($scope.data.address && $scope.tbform.address && 　$scope.tbform.address.$invalid) {
					util.showToast($rootScope, "地址填写错误，请修改");
				}
				if ($scope.data.car_no && $scope.tbform.car_no && 　$scope.tbform.car_no.$invalid) {
					util.showToast($rootScope, "车牌号填写错误，请修改");
				}
				if ($scope.data.destination && $scope.tbform.destination && 　$scope.tbform.destination.$invalid) {
					util.showToast($rootScope, "目的地填写错误，请修改");
				}

			}

		}
		$scope.getCoverageType = function(coverage_type) {
			var type = $routeParams.coverage_period ? $routeParams.coverage_period : coverage_type;
			console.log('type:' + type);
			return util.getCoverageType(type);
		}
		$scope.init = function() {

			$scope.isFirst = true;
			var effectiveDate = util.addDays(new Date(), 1)
			$scope.minDate = effectiveDate;
			$scope.user = {};
			$scope.user.effective_date = effectiveDate;
			$scope.know_contract = true;

			var effectiveDate = util.addDays(new Date(), 1);

			//$scope.money = $routeParams.estimate_money;
			$scope.getCoverageType = util.getCoverageType;
			$scope.processSpecialMoney = util.processSpecialMoney;


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

			$scope.prePromise = getHttpPromise($http, $rootScope, 'POST', api['prepare_insure'], {
				'open_id': openId,
				"insured_id": $routeParams.user_id,
				'plans': JSON.parse($routeParams.choose_plans),
				'coverage_period': $routeParams.coverage_period,
				'charge_period': $routeParams.charge_period
			}, function(res) {
				$scope.data = res.data.data;
                 var plans =  res.data.data.plans;
                 var jsonPlans = JSON.stringify(plans);
				 sessionStorage.setItem('data', jsonPlans);
				//存储需要支付的订单
				var sumMoney = $scope.data.plans.filter(function(item) {
					return item.status === 1;
				}).map(function(item) {
					return item.premium;
				}).reduce(function(preValue, currentValue, index, array) {
					return preValue + currentValue;
				}, 0);
				$scope.isFirst = !($scope.data.user && $scope.data.user.username);
				$scope.money = sumMoney;
				if (res.data.data && res.data.data.insured) {
					var relations = util.relationShip.filter(function(item) {
						return item.id == res.data.data.insured.relation;
					});
					if (relations && relations[0]) {
						$scope.userRelation = relations[0].name;
					}
				}
				$scope.canNotBuyPlans = $scope.data.plans.filter(function(plan) {
					return plan.status !== 1;
				});
				$scope.canBuyPlans = $scope.data.plans.filter(function(plan) {
					return plan.status === 1;
				});

				sessionStorage.setItem("sell_plan", JSON.stringify($scope.canBuyPlans));
				if ($scope.canNotBuyPlans.length === $scope.data.plans.length) { //全都不可购买
					$(".footer").find(".right").css({
						"background-color": "#999"
					})
				}
				if ($scope.data.min_effective_days) {
					$scope.user.effective_date = util.addDays(new Date(), $scope.data.min_effective_days);
					$scope.minDate = $scope.user.effective_date;
				}
				if ($scope.data.max_effective_days) {
					$scope.maxDate = util.addDays(new Date(), $scope.data.max_effective_days);
				}


				$scope.genPlansInEffectiveDate();
			});
		}
	}
]);


mainControllers.controller('ybwxtermsListCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope','sharedPlanIntrod',
	function($scope, $filter, $routeParams, $location, $http, $rootScope,sharedPlanIntrod) {
		$scope.init = function() {
		    var objectPlans = sessionStorage.getItem("data");
		    $scope.data = JSON.parse(objectPlans);
		    console.log(JSON.parse(objectPlans));
		}
	}
]);