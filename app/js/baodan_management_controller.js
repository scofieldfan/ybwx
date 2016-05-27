var bdControllers = angular.module('baodanControllers', []);



bdControllers.controller('ybwxBDIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		$scope.goUpload = function(source) {
			$location.path('/bd_pic').search({
				'source': source
			});
		}


	}
]);



bdControllers.controller('ybwxBdEducationCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

	}
]);
bdControllers.controller('ybwxclaim_informationCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		
	}
]);
bdControllers.controller('ybwxbd_detail_tlCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		
	}
]);
bdControllers.controller('ybwxtb_notivelCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		
	}
]);


bdControllers.controller('ybwxbaodanManageSiteCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		$scope.goBdUpload = function() {
			$location.path('/bd_pic').search();

		}
		$scope.type="";
		$scope.init = function() {
			var openId = sessionStorage.getItem("openId");
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'GET', api['get_policies_list'] + "?open_id=" + openId, {}, function(res) {
				$scope.data = res.data.data;
				$scope.typeGroup = _.groupBy(res.data.data.policies, function(item) {
					return item.insurance_type;
				});
				console.log($scope.typeGroup);
				console.log(res.data.data);
			})
		}
		$scope.init();

		$scope.filterFn = function(policy) {
			if($scope.type){
				return policy.insurance_type==$scope.type;
			}else{
				return true;
			}
		};
		$scope.goDetail = function(id) {
			$location.path('/bdm_detail').search({
				policy_id: id
			});

		}
	}
]);


bdControllers.controller('ybwxbaodanMDetailSiteCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {


		$scope.init = function() {
			var openId = sessionStorage.getItem("openId");
			var parameters = {
				'open_id':openId,
				'policy_id':$routeParams.policy_id
			}
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'GET', api['get_policy_detail'] + "?"+util.genParameters(parameters), {}, function(res) {
				$scope.data = res.data.data;
				console.log(res.data.data);
			})
		}
		$scope.init();


	}
])

bdControllers.controller('ybwxBDPicCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		$scope.images = {
			localIds: [],
			serverIds: []
		};
		$("#loading").show();
		var code = util.getParameterByName("code");
		if (!code) {
			code = $routeParams.code;
		}
		util.getOpenId(code).then(function() {
			util.uploadImgConfig(function() {
				//alert("choose...");
				$("#loading").hide();
			});
		})

		/*
		var width = $("#pre_view_image_container").width();
		var li_width = 96;//80+16
		var number = Math.floor(width/li_width);
		var margin  =  Math.floor((width - number*li_width)/number);
		$("#pre_view_image_container").find("li").css("margin-right",8+margin).css("margin-left",8+margin);
		*/
		function uploadImg2Server(mediaIds, source) {
			var openId = sessionStorage.getItem("openId");
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'POST', api['upload_policy_image'], {
				'open_id': openId,
				'media_ids': mediaIds,
				'source': source
			}, function(res) {
				console.log(res.data.data);
				$("#success_popup").show();
			})

		}


		$scope.goBdM = function() {
			$location.path('/bdm_list').search();

		}

		$scope.chooseImg = function() {
			wx.chooseImage({
				success: function(res) {

					$scope.images.localIds = res.localIds;
					//$scope.localIds = res.localIds;
					alert("成功选择" + res.localIds.length + "张图片");
					//console.log("choose.....");
					//console.log($scope.localIds);
					//console.log($scope.images);
					//alert("test 23112");
					var html = [];
					res.localIds.forEach(function(element, index) {
						html.push('<li><img src="' + element + '"></li>');
					});
					$(html.join("")).insertBefore($("#pre_view_image_container").find("li:last"));
					/*
					$("#pre_view_image_container").find("img").forEach( function(element, index) {
						console.log();
						// statements
					});*/

					//uploadImg(res.localIds);
				}
			});
		}



		$scope.uploadImg = function() {
			if ($scope.images.localIds.length == 0) {
				alert('请先选择图片');
				return;
			}
			var i = 0;
			var length = $scope.images.localIds.length;
			var serverIds = [];

			function upload() {
				wx.uploadImage({
					localId: $scope.images.localIds[i],
					isShowProgressTips: 1,
					success: function(res) {
						i++;
						// alert('已上传：' + i + '/' + length);
						serverIds.push(res.serverId);
						console.log(serverIds);
						if (i < length) {
							upload();
						} else {
							var source = $routeParams.source;
							if (!source) {
								source = '1';
							}
							uploadImg2Server(serverIds, source);
							//alert('已经全部上传完毕');
						}
					},
					fail: function(res) {
						alert(JSON.stringify(res));
					}
				});
			}
			upload();
		}



	}
]);


bdControllers.controller('ybwxTestCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		$scope.images = {
			localId: [],
			serverId: []
		};
		util.uploadImgConfig(function() {



		});

		$scope.chooseImg = function() {

			wx.chooseImage({
				success: function(res) {

					//$scope.images.localId = res.localIds;
					//$scope.localIds = res.localIds;
					alert("选择成功..." + res.localIds.length);
					//console.log("choose.....");
					//console.log($scope.localIds);
					//console.log($scope.images);
					//alert("test 23112");
					var html = [];
					res.localIds.forEach(function(element, index) {
						html.push('<img src="' + element + '">');
					});
					$("#img_container").html(html.join(""));
					uploadImg(res.localIds);
					/*	
					 $("#preview_img").attr('src',res.localIds[0]);
   					var img = document.getElementById('preview_img');*/
					$scope.$apply();
					/*	
					 */
				}
			});
		}

		function uploadImg(localIds) {
			var i = 0;
			var length = localIds.length;
			var serverIds = [];

			function upload() {
				wx.uploadImage({
					localId: localIds[i],
					isShowProgressTips: 1,
					success: function(res) {
						i++;
						// alert('已上传：' + i + '/' + length);
						serverIds.push(res.serverId);

						console.log(serverIds);
						if (i < length) {
							upload();
						}
					},
					fail: function(res) {
						alert(JSON.stringify(res));
					}
				});
			}
			upload();
		}
		/*
		$scope.uploadImg = function() {
			if (images.localId.length == 0) {
				alert('请先使用 chooseImage 接口选择图片');
				return;
			}

		}*/


	}
]);