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

	
	}
]);
//牙齿预约的详情
teethControllers.controller('ybwxDentalReservationDetailCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);

	
	}
]);


