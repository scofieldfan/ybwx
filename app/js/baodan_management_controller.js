var bdControllers = angular.module('baodanControllers', []);

bdControllers.controller('ybwxBDIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);

		$scope.upLoadMyBdPic = function() {
			if ($routeParams.isVerify == 'true') {
				goUpload("3");
			} else {
				goUpload("1");
			}
		}
		$scope.upLoadFamilyBdPic = function() {
			if ($routeParams.isVerify == 'true') {
				goUpload("4");
			} else {
				goUpload("2");
			}
		}

		function goUpload(source) {
			_hmt.push(['_trackEvent', 'bd_uploadpic_index', 'bdUploadpicIndex_goBdPic_' + source]);
			$location.path('/bd_pic').search({
				'source': source
			});
		}
	}
]);


bdControllers.controller('ybwxBdEducationCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);

		$scope.processMoney = function(money) {
			if(money==0){
				return "已投保";
			}else{
				return util.processSpecialMoney(money);
			}
		}
		$scope.getInsuranceCNname = function(){
			return insureanceCNMap[$routeParams.type];
		}
		$scope.goOldEducation = function() {
			$location.path('/education').search({
				"type":	$routeParams.type
			});
			_hmt.push(['_trackEvent', 'bd_education', 'bdEducation_goEducation']);
		}
		$scope.goUpBd = function(){
			_hmt.push(['_trackEvent', 'bd_education', 'bdEducation_goBdIndex']);
			$location.path('/bd_index');
		}
		$scope.goBdmList = function(){
			_hmt.push(['_trackEvent', 'bd_education', 'bdEducation_goBdmList']);
			$location.path('/bdm_list').search({
				"type":	$routeParams.type
			});
		}
		$scope.hexClick = function(isInsurced){
			if(isInsurced){
			_hmt.push(['_trackEvent', 'bd_education', 'bdEducation_hexBlueClick']);
				$scope.goBdmList();
			}else{
			_hmt.push(['_trackEvent', 'bd_education', 'bdEducation_hexGrayClick']);
				//$scope.goDingzhi();
				$scope.goOldEducation();
			}

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

			var code = util.getParameterByName("code");
			if (!code) {
				code = $routeParams.code;
			}
			util.getOpenId(code).then(function() {                                                                               
				var type = $routeParams.type;
				$scope.type = type;
				$scope.getUserInfo();
				var openId = sessionStorage.getItem("openId");
				$scope.myPromise = getHttpPromise($http, $rootScope, 'GET', api['get_score_analysis'].replace('{openId}', openId).replace('{type}', type), {}, function(res) {
					console.log(res.data.data);
					if (res && res.data && res.data.data) {
						$scope.data = res.data.data;
						$scope.hex = [];
						var row = [];
						res.data.data.beehive.forEach(function(element, index) {
							row.push(element);
							if ((index + 1) % 3 === 0) {
								$scope.hex.push(row);
								row = [];
							}
							// statements
						});
						if(row.length>0){
							$scope.hex.push(row);
						}
						var totalLines = Math.ceil($(window).height()/120);
						$scope.tailLines = $scope.hex.length>totalLines?2:totalLines-$scope.hex.length;
						$scope.tailLines = $scope.tailLines<2?2:$scope.tailLines;
						console.log("totalLines:"+totalLines);
						console.log("$scope.hex.length:"+$scope.hex.length);
						console.log("$scope.tailLines:"+$scope.tailLines);
						//console.log("totalLines:"+totalLines);
						//console.log("$scope.hex.length:"+$scope.hex.length);
						//console.log("$scope.tailLines:"+$scope.tailLines);
						//$scope.hiveLength = Math.ceil(res.data.data.beehive.length/3);
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

bdControllers.controller('ybwxverify_informationCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);

		$scope.init = function() {
			$scope.claimPromise = getHttpPromise($http, $rootScope, 'GET', api['get_claim_info'].replace("{id}", $routeParams.verify_info_id), {}, function(res) {
				console.log(res);
				if (res && res.data && res.data.data) {
					$scope.data = res.data.data;
					$scope.data.items.forEach(function(item) {
						item.processData = item.data.split("\|");
					})
				}
			});
		}
	}
]);


bdControllers.controller('ybwxclaim_informationCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);

		$scope.init = function() {

			$scope.claimPromise = getHttpPromise($http, $rootScope, 'GET', api['get_claim_info'].replace("{id}", $routeParams.claim_id), {}, function(res) {
				console.log(res);
				if (res && res.data && res.data.data) {
					$scope.data = res.data.data;
					$scope.data.items.forEach(function(item) {
						item.processData = item.data.split("\|");
					})
				}
			});

		}
	}
]);



bdControllers.controller('ybwxbaodanVerifyListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);
		$scope.goBdUpload = function() {
			_hmt.push(['_trackEvent', 'bdm_verifylist', 'bdmVerifyList_goUpload']);
			$location.path('/bd_index').search({
				'isVerify': 'true'
			});
		}
		$scope.type = "4";
		$scope.init = function() {

			var code = util.getParameterByName("code");
			if (!code) {
				code = $routeParams.code;
			}
			util.getOpenId(code).then(function() {
				var openId = sessionStorage.getItem("openId");
				$scope.loadingPromise = getHttpPromise($http, $rootScope, 'GET', api['get_verfiy_policy'] + "?open_id=" + openId, {}, function(res) {
					$scope.data = res.data.data;
					$scope.typeGroup = _.groupBy(res.data.data.policies, function(item) {
						return item.insurance_type;
					});
					console.log($scope.typeGroup);
					console.log(res.data.data);
				})
			})

		}
		$scope.setType = function(type) {
			_hmt.push(['_trackEvent', 'bdm_verifylist', 'bdmVerifyList_nav']);
			$scope.type = type;
		}
		$scope.init();


		$scope.goVerifyInfoPage = function(verify_info_id) {
			_hmt.push(['_trackEvent', 'bdm_verifylist', 'bdmVerifyList_gobdmverifyinfo']);
			$location.path('/verify_information').search({
				verify_info_id: verify_info_id
			});
		}
		$scope.goDetail = function(id) {
			_hmt.push(['_trackEvent', 'bdm_verifylist', 'bdmVerifyList_gobdmdetail']);
			$location.path('/bdm_detail').search({
				policy_id: id
			});

		}
	}
]);

bdControllers.controller('ybwxbaodanManageListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		_hmt.push(['_trackPageview', $location.path()]);
		$scope.goBdUpload = function() {
			_hmt.push(['_trackEvent', 'bdm_list', 'bdmList_goUpload']);
			$location.path('/bd_index').search();
		}
		if($routeParams.type){
			$scope.type = $routeParams.type;
		}else{
			$scope.type = "4";
		}
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
		$scope.setType = function(type) {
			_hmt.push(['_trackEvent', 'bdm_list', 'bdmList_nav']);
			$scope.type = type;
		}
		// $scope.getListtype = function(type) {
		// 	_hmt.push(['_trackEvent', 'bdm_list', 'nav']);
		// 	$scope.type = type;
		// }
		$scope.init();

		$scope.filterFn = function(policy) {
			if ($scope.type) {
				return policy.insurance_type == $scope.type;
			} else {
				return true;
			}
		};
		$scope.goClaimInfo = function(claim_id) {
			_hmt.push(['_trackEvent', 'bdm_list', 'bdmList_goClaimInfo']);
			$location.path('/claim_information').search({
				'claim_id': claim_id
			});
		}
		$scope.goDetail = function(id) {
			_hmt.push(['_trackEvent', 'bdm_list', 'bdmList_gobdmdetail']);
			$location.path('/bdm_detail').search({
				policy_id: id
			});

		}
	}
]);


bdControllers.controller('ybwxbaodanMDetailSiteCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);

		$scope.isTest = false; //示例保单

		$scope.processMoney = function(money) {
			return util.processSpecialMoney(money);
		}
		$scope.init = function() {

			var code = util.getParameterByName("code");
			if (!code) {
				code = $routeParams.code;
			}
			if ($routeParams.policy_id && $routeParams.policy_id == 'test') {
				$scope.isTest = true;
				$("#test_baodan").show();
			} else {
				$("#my_baodan").show();
			}
			util.getOpenId(code).then(function() {

				if (!$scope.isTest) {
					var openId = sessionStorage.getItem("openId");
					if ($routeParams.share_id) {
						openId = $routeParams.share_id;
					}
					var parameters = {
						'open_id': openId,
						'policy_id': $routeParams.policy_id
					}
					$scope.loadingPromise = getHttpPromise($http, $rootScope, 'GET', api['get_policy_detail'] + "?" + util.genParameters(parameters), {}, function(res) {
						$scope.data = res.data.data;
						$scope.data.coverageDateHead = res.data.data.coverageDate.substring(0, 19).trim();
						$scope.data.coverageDateTail = res.data.data.coverageDate.substring(19).trim();
						console.log($scope.data.coverageDateHead);
						console.log($scope.data.coverageDateTail);
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
		$scope.goVerifyInfoPage = function(verify_info_id) {
			_hmt.push(['_trackEvent', 'bdm_detail', 'bdmDetail_gobdmVerifyInfo']);
			$location.path('/verify_information').search({
				verify_info_id: verify_info_id
			});
		}
		$scope.goClaimInfo = function(claim_id) {
			_hmt.push(['_trackEvent', 'bdm_detail', 'bdmDetail_goClaimInfo']);
			$location.path('/claim_information').search({
				'claim_id': claim_id
			});
		}
		$scope.yanzhentext = "保单验真";
		$scope.policy_verfiy = function() {

			if ($scope.data.status != 1) {
				return;
			}
			var openId = sessionStorage.getItem("openId");

			var parameters = {
				'open_id': openId,
				'policy_id': $routeParams.policy_id
			};
			getHttpPromise($http, $rootScope, 'GET', api['policy_verfiy'] + "?" + util.genParameters(parameters), {}, function(res) {
				console.log(res);
				if (res && res.data.code == 0) {
					$scope.data.status = 2;
					$scope.yanzhentext = "验真中...."
				}
				//$scope
			});

		}
		$scope.getChargePeroidTypeAbbre = function(type) {
			return chargePeriodTypeAbbreMap[type];
		}
		$scope.getChargePeroidType = function(type) {
			return chargePeriodTypeMap[type];
		}
		$scope.showTip = function() {
			_hmt.push(['_trackEvent', 'bdm_detail', 'bdmDetail_shareTip']);
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
			util.share({
				"shareTitle":"我的保单",
				"shareUrl":shareUrl,
				"shareDesc":"这是我在诺贝保险管家的保单。诺贝保险管家，保险本该如此!",
				"shareImg":"http://web.youbaowuxian.com/img/icon.jpg"
			});

			/*
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

			})*/
		}
		$scope.preview = function() {
			_hmt.push(['_trackEvent', 'bdm_detail', 'bdmDetail_previewImg']);
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
			_hmt.push(['_trackEvent', 'bdm_uploadpic', 'bdmuploadpic_goBdmList']);
			if ($routeParams.source == 3 || $routeParams.source == 4) {
				$location.path('/bd_verify_list').search();
			} else {
				$location.path('/bdm_list').search();
			}

		}

		$scope.chooseImg = function() {
			_hmt.push(['_trackEvent', 'bdm_uploadpic', 'bdmuploadpic_chooseImage']);
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
			_hmt.push(['_trackEvent', 'bdm_uploadpic', 'bdmuploadpic_uploadImage']);
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