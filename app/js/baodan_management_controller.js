var bdControllers = angular.module('baodanControllers', []);



bdControllers.controller('ybwxBDIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);
		$scope.goUpload = function(source) {
			_hmt.push(['_trackEvent', 'bd_uploadpic_index', 'goBdPic_'+source]);
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
		_hmt.push(['_trackPageview', $location.path()]);

		$scope.init = function() {

			$scope.claimPromise = $http({
				method: 'GET',
				headers: {
					"Content-Type": "application/json;charset:UTF-8"
				},
				url: api['get_claim_info'].replace("{id}",$routeParams.claim_id)
			}).then(function(res) {
				console.log(res);
				if (res && res.data && res.data.data) {
					$scope.data = res.data.data;
					$scope.data.items.forEach(function(item){
						item.processData = item.data.split("\|");
					})
					// 一行显示
				}
			}, function(res) {
				console.log(res);
				util.showToast($rootScope, "服务器错误");
			});


		}

	}
]);
bdControllers.controller('ybwxtb_notivelCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		

	}
]);


bdControllers.controller('ybwxbaodanManageListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		$scope.goBdUpload = function() {
			_hmt.push(['_trackEvent', 'bdm_list', 'goUpload']);
			$location.path('/bd_index').search();
		}
		$scope.type = "4";
		$scope.init = function() {

			var code = util.getParameterByName("code");
			if (!code) {
				code = $routeParams.code;
			}
			util.getOpenId(code).then(function() {
				var openId = sessionStorage.getItem("openId");
				$scope.loadingPromise = getHttpPromise($http, $rootScope, 'GET', api['get_policies_list'] + "?open_id=" + openId, {}, function(res) {
					$scope.data = res.data.data;
					$scope.typeGroup = _.groupBy(res.data.data.policies, function(item) {
						return item.insurance_type;
					});
					console.log($scope.typeGroup);
					console.log(res.data.data);
				})
			})

		}
		$scope.setType = function(type){
			_hmt.push(['_trackEvent', 'bdm_list', 'nav']);
			$scope.type=type;
		}
		$scope.init();

		$scope.filterFn = function(policy) {
			if ($scope.type) {
				return policy.insurance_type == $scope.type;
			} else {
				return true;
			}
		};
		$scope.goClaimInfo = function(claim_id){
			_hmt.push(['_trackEvent', 'bdm_list', 'goClaimInfo']);
			$location.path('/claim_information').search({
				'claim_id': claim_id
			});
		}	
		$scope.goDetail = function(id) {
			_hmt.push(['_trackEvent', 'bdm_list', 'gobdm_detail']);
			$location.path('/bdm_detail').search({
				policy_id: id
			});

		}
	}
]);


bdControllers.controller('ybwxbaodanMDetailSiteCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);

		$scope.isTest = false;//示例保单
		
		$scope.processMoney = function(money) {
			return util.processSpecialMoney(money);
		}
		$scope.init = function() {

			var code = util.getParameterByName("code");
			if (!code) {
				code = $routeParams.code;
			}
			if($routeParams.policy_id && $routeParams.policy_id == 'test'){
				$scope.isTest = true;
				$("#test_baodan").show();
			}else{
				$("#my_baodan").show();
			}
			util.getOpenId(code).then(function() {

				if (!$scope.isTest) {
					var openId = sessionStorage.getItem("openId");
					if($routeParams.share_id){
						openId = $routeParams.share_id;
					}
					var parameters = {
						'open_id': openId,
						'policy_id': $routeParams.policy_id
					}
					$scope.loadingPromise = getHttpPromise($http, $rootScope, 'GET', api['get_policy_detail'] + "?" + util.genParameters(parameters), {}, function(res) {
						$scope.data = res.data.data;
						console.log(res.data.data);
						$(".bd-wrapper").show();
					})
				}
				$scope.shareConfig();
			});
			//util.uploadImgConfig(function() {
			//alert("choose...");
			//});
		}
		$scope.goClaimInfo = function(claim_id){
			_hmt.push(['_trackEvent', 'bdm_detail', 'goClaimInfo']);
			$location.path('/claim_information').search({
				'claim_id': claim_id
			});
		}	

		$scope.getChargePeroidTypeAbbre = function(type){
			return chargePeriodTypeAbbreMap[type];
		}
		$scope.getChargePeroidType = function(type){
			return chargePeriodTypeMap[type];
		}
		$scope.showTip = function(){
			_hmt.push(['_trackEvent', 'bdm_detail', 'shareTip']);
			$("#share").show();
		}
		$scope.shareConfig = function() {
			var openId = sessionStorage.getItem("openId");
			var params = {
				'policy_id': $routeParams.policy_id,
				'share_id': openId
			}
			var paramStr = util.genParameters(params);
			var shareUrl = "http://web.youbaowuxian.com/#bdm_detail?" + paramStr;
			$scope.thirdPromise = getHttpPromise($http, $rootScope, 'GET', api['signature'] + "?url=" + encodeURIComponent(location.href.split('#')[0]), {}, function(res) {
				console.log(res);
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: res.data.data["app_id"], // 必填，公众号的唯一标识
					timestamp: res.data.data["timestamp"], // 必填，生成签名的时间戳
					nonceStr: res.data.data["noncestr"], // 必填，生成签名的随机串
					signature: res.data.data["signature"], // 必填，签名，见附录1
					jsApiList: ['previewImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
				});
				wx.ready(function() {
					console.log("wexin success....")
					// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
					var shareTitle = "我的保单";
					var shareLink = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx526ab87a436ee1c3&redirect_uri=' + encodeURIComponent(shareUrl) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
					//var shareLink = shareUrl;
					var shareDesc = "这是我在诺贝保险管家的保单。诺贝保险管家，保险本该如此!";
					var shareImg = "http://web.youbaowuxian.com/img/icon.jpg";

					wx.onMenuShareTimeline({
						title: shareTitle,
						link: shareLink,
						imgUrl: shareImg,
						success: function() {},
						cancel: function() {}
					});
					wx.onMenuShareAppMessage({
						title: shareTitle,
						desc: shareDesc,
						link: shareLink,
						imgUrl: shareImg,
						dataUrl: '',
						success: function() {},
						cancel: function() {}
					});
				});

			})
		}
		$scope.preview = function() {
			_hmt.push(['_trackEvent', 'bdm_detail', 'previewImg']);
			wx.previewImage({
				current: $scope.data.image_urls[0], // 当前显示图片的http链接
				urls: $scope.data.image_urls // 需要预览的图片http链接列表
			});
		}
		$scope.init();


	}
])

bdControllers.controller('ybwxBDPicCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);
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
			_hmt.push(['_trackEvent', 'bdm_uploadpic', 'goBdmList']);
			$location.path('/bdm_list').search();

		}

		$scope.chooseImg = function() {
			_hmt.push(['_trackEvent', 'bdm_uploadpic', 'chooseImage']);
			wx.chooseImage({
				success: function(res) {

					$scope.images.localIds = res.localIds;
					//$scope.localIds = res.localIds;
					// alert("成功选择" + res.localIds.length + "张图片");
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
			_hmt.push(['_trackEvent', 'bdm_uploadpic', 'uploadImage']);
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

