/*
* @Author: fanzhang
* @Date:   2016-08-30 10:34:57
* @Last Modified by:   fanzhang
* @Last Modified time: 2016-09-02 10:38:51
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


