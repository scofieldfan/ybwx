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
		$scope.goReservationDetail = function() {
			console.log("?????????????");
            $scope.appoint_id = $(".teeth-title-container").attr("data-appointment");
			$location.path("/dental/reservation_detail").search({
                appointment_id: $scope.appoint_id
			});
		}
		$scope.goChildDental = function () {
		 	console.log("/////");
		 	$location.path("/child_dental");
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
// 选择医生跳转后的页面
teethControllers.controller('ybwxSelectDoctor', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		$scope.goConfirm = function() {
			console.log("docter");
			$scope.postPrime = getHttpPromise($http, $rootScope, 'POST', api['submit_reservation'], {
				appointment_id: $routeParams.appointment_id,
				doctor_id: $routeParams.doctor_id
			}, function(res) {
				if(res.data.code !== 0) {
					util.showToast($rootScope, res.data.msg);
				}else{
					console.log("docterSelect");
					$location.path("/dental/confirm");
				};
			})
		}
	}
]);
// 未购买页 立即购买
// teethControllers.controller('ybwxDentalNoShopCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
// 	function($scope, $routeParams, $location, $http, $rootScope) {
// 	 $scope.goChildDental = function () {
// 	 	console.log("/////");
// 	 	$location.path("/child_dental");
// 	 }
// 	}
// ]);
teethControllers.controller('ybwxDentalConfirmCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
	 $scope.goReservationList = function () {
	 	console.log("确定");
	 	$location.path("/dental/reservation_list");
	 }
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
		$("#switch .switch-child").click(function(){
			$("#switch").find(".switch-child").removeClass("border_3px");
			$(this).addClass("border_3px").show();
	        $(document).scrollTop(424);
			// $("#switch").find("li").addClass("blue");

		});
	    $("body").on("click",".head-container",function(event){
	        event.preventDefault();
	        event.stopPropagation();
	        return false;
	    }); 
	   	$(window).scroll(function(){
	      var y=$(document).scrollTop();
	      if(y> $(window).height()){
	        $('#switch').addClass('position');
	      }else{
	        $('#switch').removeClass('position');
	      }  
	      // console.log(y);
	      // console.log($(window).height());
	    })
	    $("#switch .switch-child:eq(1)").click(function(){
	        $("#taocan").show();
	        $("#jianjie").hide();
	        $("#yiyuan").hide();
	    });
	    $("#switch .switch-child:eq(2)").click(function(){
	        $("#yiyuan").show();
	        $("#jianjie").hide();
	        $("#taocan").hide();
	    });
	    $("#switch .switch-child:eq(0)").click(function(){
	        $("#jianjie").show();
	        $("#yiyuan").hide();
	        $("#taocan").hide();
	    });
		if($routeParams.package_id == 1) {
			$(document).scrollTop($(".main-list").offset().top);
			$("#switch").find(".switch-child").removeClass("border_3px");
			$("#switch").find(".switch-child:eq(1)").addClass("border_3px");
			$("#taocan").show();
			$("#jianjie").hide();
		}
		// console.log($routeParams.package_id);
		// console.log("package_id");
	}
]);




