/*
* @Author: fanzhang
* @Date:   2016-08-30 10:34:57
* @Last Modified by:   fanzhang
* @Last Modified time: 2016-09-02 16:04:13
*/

'use strict';

/* Controllers */

var teethControllers = angular.module('dentalControllers', []);

//牙齿预约的记录
teethControllers.controller('ybwxDentalReservationCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
        
		_hmt.push(['_trackPageview', $location.path()]);
		
		$scope.goDentalDocter = function() {
			$scope.dentalId = $(".ybwx-btn").attr("data-id");
			// console.log($scope.dentalId);
			$location.path("/dental_docter").search({
				docter_id:$scope.dentalId
			});
		}
	}
]);
teethControllers.controller('ybwxDental_docterCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		$scope.goDocter_detail = function() {
			$scope.dentalId = $(".docter_pic").attr("data-id");
			console.log($scope.dentalId);
			$location.path("/docter_detail").search({
				docter_id:$routeParams.docter_id,
				docter_id1:$scope.dentalId
			});
		}
	}
]);
//牙齿预约的详情
teethControllers.controller('ybwxDentalReservationDetailCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);

	
	}
]);

//齿科首页
teethControllers.controller('ybwxChildDentailCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);

		$scope.taocan = 577;
		
		$scope.close = function(){
			$("#dental_mask_container").hide();	
		}
		$scope.home = function(){
			$location.path("/index");
		}
		$scope.showMask = function(){
			$("#dental_mask_container").show();	
		}
		$scope.showQrcode = function(){
			$(".qrcode-wrapper").toggle();
		}
		$scope.choose  = function($event,taocanId){
			var element = $event.currentTarget;
			$(element).parents(".taocan").find(".ybwx-btn").removeClass("ybwx-btn--primary").addClass("ybwx-btn--white");
			$(element).removeClass("ybwx-btn--white").addClass("ybwx-btn--primary");
			$scope.taocan = taocanId;

		}
		$scope.submit = function(){
			$location.path("/toubao_new").search({
				plan_id:$scope.taocan,
				new_choose_plans:JSON.stringify([{
					id:$scope.taocan,
					coverage_period:1
				}])
			});
		}
		$scope.showToast = function(type) {
			console.log(type);
			$("#toast_"+type).show();
			$("#toast_"+type).click(function(event) {
				// event.preventDefault();
   	// 		 	event.stopPropagation();
    // 			return false;
				
				if(event.target==this){
					$(this).hide();
					console.log("................");
				}
			})
		}
	}
]);




