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
		
		$scope.goDentalDoctor = function() {
            $scope.appointment_id = $(".ybwx-btn").attr("data-id");

			$location.path("/dental/select_hospital").search({
                appointment_id: $scope.appointment_id,
			});
		}
	}
]);
teethControllers.controller('ybwxDental_doctorCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		$scope.goDoctor_detail = function() {
			$scope.doctor_id = $(".doctor_pic").attr("data-doctor-id");
			$location.path("/dental/select_doctor").search({
				appointment_id: $routeParams.appointment_id,
                doctor_id: $scope.doctor_id
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
	}
]);




