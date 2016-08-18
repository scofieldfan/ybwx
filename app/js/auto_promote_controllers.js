/*
* @Author: fanzhang
* @Date:   2016-08-18 13:57:26
* @Last Modified by:   fanzhang
* @Last Modified time: 2016-08-18 13:58:41
*/

'use strict';

/*一键提升==保障对象*/
var autoPromoteControllers = angular.module('autoPromoteControllers', []);
autoPromoteControllers.controller('ybwxTargetCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $filter, $routeParams, $location, $http, $rootScope) {

		$scope.relation = 1;
		var code = util.getParameterByName("code") || $routeParams.code;
		util.getOpenId(code).then(function() {

		});
		// 临时的后期还会变动 start
		// $("#relation .column .column_btn").click(function() {
		$("#relation .column .linshi").click(function() {
			$("#relation").find(".linshi").removeClass("blue");
			$(this).addClass("blue");
			$scope.relation = $(this).attr("data-relation");
		});
		$("#relation .column .no_up").click(function() {
			util.showToast($rootScope,"即将上线 敬请期待");
		});
		// end
		$scope.clickBtn = function(type) {
			_hmt.push(['_trackEvent', 'Target', 'clickBtn_'+type]);
		}
		$scope.goUserInfoNew = function() {
			$location.path("/userinfo_new").search({
				relation: $scope.relation
			});
			_hmt.push(['_trackEvent', 'Target', 'goUserInfoNew']);
			console.log($scope.relation);
		}
	}
]);

/*一键提升==资料设定*/
autoPromoteControllers.controller('ybwxUserInfoNewCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $filter, $routeParams, $location, $http, $rootScope) {
		var ageComponent = new AgeComponent({
			containerId: "ageContainer",
			minAge: 25,
			maxAge: 45,
			startAge: 30,
			yearDis: 7.5,
			changeCallback: function(age) {
				$("#ageId").html(age);
				// if(age == 25 || age == 45){
				// 	util.showToastJQ("目前仅支持25岁-45岁");
				// }
			},
			beyondLeftCallback:function(){
				util.showToastJQ("目前仅支持25岁-45岁");
			},
			beyondRightCallback:function(){
				util.showToastJQ("目前仅支持25岁-45岁");
			}
		});

		var yearIncome = new AgeComponent({
			containerId: "yearIncome",
			minAge: 5,
			maxAge: 50,
			startAge: 20,
			yearDis: 7.5,
			changeCallback: function(yearIncomeId) {
				$("#yearIncomeId").html(yearIncomeId);
				// if(yearIncomeId == 10 || yearIncomeId == 40){
				// 		util.showToastJQ("目前仅支持10万-40万");
				// }
				if( yearIncomeId == 5){
					$("#sui").text("万及以下");
				}
				if( yearIncomeId == 50 ){
					$("#sui").text("万及以上");
				}
				if(yearIncomeId !== 5 && yearIncomeId !== 50){
					$("#sui").text("万");
				}
			}
			/*beyondLeftCallback:function(){
				util.showToastJQ("目前仅支持10万到50万");
			},
			beyondRightCallback:function(){
				util.showToastJQ("目前仅支持10万-50万");
			}*/
		});
		// console.log();
		$scope.yes_no = function() {
			_hmt.push(['_trackEvent', 'UserInfoNew', 'sex']);
		}
		$scope.sex = function() {
			_hmt.push(['_trackEvent', 'UserInfoNew', 'yes_no']);
		}
		$scope.goHobby = function() {
			$scope.primary_income = $(".primary_income").is(':checked') ? false : true;
			$scope.sex = parseInt($(".sex").is(':checked') ? 2 : 1);
			$scope.age = parseInt($("#ageId").html());
			$scope.income = parseInt($("#yearIncomeId").html());
			$location.path("/hobby").search({
				relation: $routeParams.relation,
				primary_income: $scope.primary_income,
				sex: $scope.sex,
				age: $scope.age,
				income: $scope.income
			});
			_hmt.push(['_trackEvent', 'UserInfoNew', 'goHobby']);
		}
	}
]);

/*一键提升==偏好设定*/
autoPromoteControllers.controller('ybwxHobbyCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $filter, $routeParams, $location, $http, $rootScope) {
		$scope.init = function() {
			var openId = sessionStorage.getItem("openId");
			$scope.hobbyPromise = getHttpPromise($http, $rootScope, 'POST', api['get_scheme_questions'], {
				"open_id": openId
				// "age": $routeParams.age
			}, function(res) {
				$scope.data = res.data.data.questions;
			});
		}
		$scope.setId = function($event) {
			if($($event.target).hasClass("hobby_btn")){
				$($event.target).toggleClass("blue");
				$($event.target).find("img").toggle();
			}
			_hmt.push(['_trackEvent', 'hobby', 'setId']);
		}	
		// $(".promoteImg").click(function(event){
	 //        event.stopPropagation();
	 //    });
		$scope.goScheme = function() {
			$scope.piont_type = parseInt($(".piont_type").is(':checked') ? 2 : 1);
			$ele = $("#relation").find(".blue");
			var questions = [];
			for (i = 0; i < $ele.length; i++) {
				questions.push(parseInt($($ele[i]).attr("data-main")));
			}
			$location.path("/scheme").search({
				relation: $routeParams.relation,
				primary_income: $routeParams.primary_income,
				sex: $routeParams.sex,
				age: $routeParams.age,
				income: $routeParams.income,
				piont_type: $scope.piont_type,
				questions: JSON.stringify(questions)
			});
			_hmt.push(['_trackEvent', 'hobby', 'goScheme']);
		}
	}
]);

/*一键提升==方案解读*/
autoPromoteControllers.controller('ybwxSchemeCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $filter, $routeParams, $location, $http, $rootScope) {
		$scope.init = function() {
			var openId = sessionStorage.getItem("openId");
			console.log($routeParams.piont_type);
			$scope.schemaPromise = getHttpPromise($http, $rootScope, 'POST', api['get_scheme'], {
				"open_id": openId,
				"relation": $routeParams.relation,
				"primary_income": $routeParams.primary_income,
				"gender": $routeParams.sex,
				"age": $routeParams.age,
				"annual_income": $routeParams.income,
				"type": $routeParams.piont_type,
				"questions": JSON.parse($routeParams.questions)
			}, function(res) {
				$scope.data = res.data.data;
				$scope.scheme_id = res.data.data.scheme_id;

			});
		}
		$scope.goKeySolution = function() {
			$location.path("/key_solution").search({
				name: $scope.data.scheme_name,
				sex: $routeParams.sex,
				age: $routeParams.age,
				questions: $routeParams.questions,
				primary_income: $routeParams.primary_income,
				annual_income: $routeParams.income,
				relation: $routeParams.relation,
				scheme_id: $scope.scheme_id
			});
			_hmt.push(['_trackEvent', 'scheme', 'goKeySolution']);
		}
	}
]);
/*一键提升==保障方案*/
autoPromoteControllers.controller('ybwxKeySolutionCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $filter, $routeParams, $location, $http, $rootScope) {
		$scope.init = function() {

			$scope.showNum = 6;

			$scope.name = $routeParams.name;

			$scope.age = $routeParams.age;

			$scope.sex = $routeParams.sex;

			$scope.annualIncome = $routeParams.annual_income;

			$scope.primaryIncome = $routeParams.primary_income;

			$scope.getCoverageType = util.getCoverageType;

			$scope.relation = $routeParams.relation;

			var openId = sessionStorage.getItem("openId");
			$scope.solutionPromise = getHttpPromise($http, $rootScope, 'POST', api['get_scheme_plans'], {
				"open_id": openId,
				"scheme_id": $routeParams.scheme_id, //方案id
				"gender": $routeParams.sex,
				"age": $routeParams.age,
				"questions": JSON.parse($routeParams.questions)
			}, function(res) {
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
			});

		}
		$scope.processSpecialMoney = function(money) {
			var money = util.processSpecialMoney(money);
			if (money === "0元") {
				return "赠送"
			} else {
				return money;
			}
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
		$scope.more = function($event) {
			var element = $event.currentTarget;
			var switchValue = $(element).attr("data-switch");
			var num = $scope.showNum - 1;
			if (switchValue === 'on') {
				$(element).siblings(".table-wrapper").find("tr").show();
				$(element).find("span").html("收起");
				$(element).attr("data-switch", "off");
				$(element).find("div").addClass("up");
				_hmt.push(['_trackEvent', 'keySolution', 'keySolution_unfold']);
			} else {
				$(element).siblings(".table-wrapper").find("tr:gt(" + num + ")").hide();
				$(element).find("span").html("查看更多");
				$(element).attr("data-switch", "on");
				$(element).find("div").removeClass("up");
				_hmt.push(['_trackEvent', 'keySolution', 'keySolution_fold']);
			}
		}

		$scope.go = function(plan) {

			if (plan.status === 1) {
				plan.unchecked = !plan.unchecked;
				$scope.choosePlan();
			}
			_hmt.push(['_trackEvent', 'keySolution', 'keySolution_gou']);
		}
		$scope.choosePlan = function() {
			_hmt.push(['_trackEvent', 'keySolution', 'keySolution_choose']);
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

		}

		$scope.goDetail = function(plan) {

			if (plan.status === 1) { //可购买跳转至产品详情页
				if (plan.insurance_status !== 1) {
					$location.path('/temaidetail').search({
						product_id: plan.insurance_id
					});
					_hmt.push(['_trackEvent', 'keySolution', 'keySolution_goDetail']);

				}
			} else {
				//window.location.href = plan.official_site;
				if (plan.provision_page_id) {
					var param = {
						webPageId: plan.provision_page_id,
						insuranceId: plan.insurance_id
					}
					var parmStr = util.genParameters(param);
					window.location.href = util.domain + "ybwx-web/api/webPage?" + parmStr;
				} else {
					window.location.href = plan.official_site;
				}
				_hmt.push(['_trackEvent', 'keySolution', 'keySolution_goDetail']);
			}
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
		$scope.return = function() {
			//userinfo_new?relation=1
			$location.path('/userinfo_new').search({
				relation: $routeParams.relation
			});
			_hmt.push(['_trackEvent', 'keySolution', 'reuturn']);
		}
		$scope.getTaoCanStatus = util.getTaoCanStatus;
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

		$scope.goInfo = function() {
			_hmt.push(['_trackEvent', 'keySolution', 'keySolution_subBtn']);


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