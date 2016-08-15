'use strict';

/* Controllers */

var serviceControllers = angular.module('serviceControllers', []);

serviceControllers.controller('ybwxServiceCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);

		var cellClass = ".cell-footer";
		$scope.goIndex = function($event) {
			//$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
			//$($event.target).parents(cellClass).addClass("hover");
			$location.path('/').search();
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

		$scope.goVerfiy = function() {
			$location.path('/bd_verify_list').search();
		}
		$scope.goInsuranceCard = function() {
			//$location.path('/bd_verify_list').search();
			window.location = "/wx_share.html#/couponlist";
		}
		$scope.goTradeRecord = function() {
			$location.path('/bd_list').search();
		}

		$scope.goBaoDan = function() {
			$location.path('/bdm_list').search();
		}

		$scope.goContact = function() {
			$location.path('/contact').search();
		}

		$scope.goAboutme = function() {
			window.location.href = "http://mp.weixin.qq.com/s?__biz=MzI0NDE2Mjk2OA==&mid=407057806&idx=1&sn=d6136f57ac70f0ae4504c657355a6989#wechat_redirect";
		}
		$scope.goNuobei = function() {
			$location.path('/about_nuobei').search();
		}
		$scope.goCollection = function() {
			$location.path('/collection').search();
		}
	}
]);
