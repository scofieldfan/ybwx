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
			_hmt.push(['_trackEvent', 'bd_uploadpic_index', 'bdUploadpic_family']);
		}

		function goUpload(source) {
			_hmt.push(['_trackEvent', 'bd_uploadpic_index', 'bdUploadpicIndex_goBdPic_' + source]);
			$location.path('/bd_pic').search({
				'source': source
			});
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

			var code = util.getParameterByName("code") || code;

			util.getOpenId(code).then(function() {
				var openId = sessionStorage.getItem("openId");
				$scope.loadingPromise = getHttpPromise($http, $rootScope, 'GET', api['get_verfiy_policy'] + "?open_id=" + openId, {}, function(res) {
					$scope.data = res.data.data;
					$scope.typeGroup = _.groupBy(res.data.data.policies, function(item) {
						return item.insurance_type;
					});
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
		$scope.type = $routeParams.type || "4";
		$scope.init = function() {
			var code = util.getParameterByName("code") || $routeParams.code;
			util.getOpenId(code).then(function() {
				var openId = sessionStorage.getItem("openId");
				$scope.loadingPromise = getHttpPromise($http, $rootScope, 'GET', api['get_policies_list'] + "?open_id=" + openId, {}, function(res) {
					$scope.data = res.data.data;
					$scope.typeGroup = _.groupBy(res.data.data.policies, function(item) {
						return item.insurance_type;
					});
				})
			})
		}
		$scope.setType = function(type) {
			_hmt.push(['_trackEvent', 'bdm_list', 'bdmList_nav']);
			$scope.type = type;
		}

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

			var code = util.getParameterByName("code") || $routeParams.code;

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
			var shareUrl = util.domain + "#bdm_detail?" + paramStr;
			util.share({
				"shareTitle": "我的保单",
				"shareUrl": shareUrl,
				"shareDesc": "这是我在诺贝保险管家的保单。诺贝保险管家，保险本该如此!",
				"shareImg": util.domain + "img/icon.jpg"
			});

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
bdControllers.controller('ybwxUpdateAddContactCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {

		_hmt.push(['_trackPageview', $location.path()]);


		$scope.state = false;
		$scope.relation = {

			id: 3,
			name: '子女'

		};
		$scope.getState = function() {
			$scope.state = document.getElementById("checkbox").checked;
			// console.log($scope.state);
		}
		var openId = sessionStorage.getItem("openId");
		var userId = $routeParams.user_id;
		$scope.method = $routeParams.method;
		var isUpdate = false;
		if ($routeParams.method && $routeParams.method === "edit") {
			//修改逻辑
			isUpdate = true;
		}

		$scope.relations = util.modifyRelationShip;
		$scope.save = function() {
			_hmt.push(['_trackEvent', 'update_add_contact', 'update_add_contact_save']);
			if (isUpdate) {
				//更新
				$scope.editUserInfo(userId);
			} else {
				//添加
				$scope.addPeople();
				_hmt.push(['_trackEvent', 'update_add_contact', 'addPeople_btn']);
			}
		}
		$scope.addPeople = function() {
			// 新增被保险人

			$scope.secondPromise = getHttpPromise($http, $rootScope, 'POST', api['addContact'], {
				open_id: openId,
				relation: $scope.relation.id,
				is_default: $scope.state,
				username: $scope.username,
				social_id: $scope.social_id,
				mobile: $scope.mobile
			}, function(res) {
				console.log(res.data.data);
				$location.path('/contact_list').search({
					choose_plans: $routeParams.choose_plans,
					coverage_period_type: $routeParams.coverage_period_type,
					coverage_period: $routeParams.coverage_period,
					charge_period_type: $routeParams.charge_period_type,
					charge_period: $routeParams.charge_period
				});

			})
		}
		// 删除被保险人资料

		$scope.deleteMessage = function() {
			_hmt.push(['_trackEvent', 'update_add_contact', 'update_add_contact_delete']);
			$("#dialog1").show(function() {
				$scope.sure = function() {
					$scope.secondPromise = getHttpPromise($http, $rootScope, 'POST', api['deleteContact'], {
						'open_id': openId,
						'insured_id': userId
					}, function(res) {
						// if(res && res.data && res.data.data.){
						$location.path("/contact_list").search({
							'choose_plans': $routeParams.choose_plans,
							coverage_period_type: $routeParams.coverage_period_type,
							coverage_period: $routeParams.coverage_period,
							charge_period_type: $routeParams.charge_period_type,
							charge_period: $routeParams.charge_period
						});

						// }

					});
				}
				$scope.cancel = function() {
					$("#dialog1").hide();
				}
			});
		}
		// $scope.relation = {
		// 	id: 4,
		// 	name: '配偶'
		// };
		// 获取被保险人资料
		$scope.getUserInfo = function(userId) {
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'POST', api['getData'], {
				'open_id': openId,
				"insured_id": userId
			}, function(res) {
				if (res && res.data && res.data.data.relations) {



					if (res.data.data.relations[0]) {
						$scope.username = res.data.data.relations[0].username;
						$scope.social_id = res.data.data.relations[0].social_id;
						$scope.mobile = res.data.data.relations[0].mobile;

						var relationAry = util.relationShip.filter(function(item) {
							return item.id === res.data.data.relations[0].relation;
						});

						if (Array.isArray(relationAry) && relationAry[0]) {
							$scope.relation = relationAry[0];
						}

						console.log($scope.relation);
						$scope.state = res.data.data.relations[0].is_default;
					}
				}
				// console.log(res.data.data);
			})
		}
		if (isUpdate) {
			//修改页面
			$scope.getUserInfo(userId);
		}
		// 更新被保险人
		$scope.editUserInfo = function(insured_id) {
			_hmt.push(['_trackEvent', 'update_add_contact', 'update_add_contact_edit']);
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'POST', api['update'], {
				'open_id': openId,
				"insured_id": insured_id,
				'relation': $scope.relation.id,
				'is_default': $scope.state,
				'username': $scope.username,
				'social_id': $scope.social_id,
				'mobile': $scope.mobile
			}, function(res) {
				if (res && res.data && res.data.data.user) {
					//$scope.data = res.data.data.relations;
					$location.path("/contact_list").search({
						choose_plans: $routeParams.choose_plans,
						coverage_period_type: $routeParams.coverage_period_type,
						coverage_period: $routeParams.coverage_period,
						charge_period_type: $routeParams.charge_period_type,
						charge_period: $routeParams.charge_period

					});

				}

			})
		}
	}
]);
bdControllers.controller('ybwxContactListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {


		_hmt.push(['_trackPageview', $location.path()]);

		$scope.getRelation = function(relation) {
			var relationAry = util.relationShip.filter(function(item) {
				return item.id === relation;
			});
			if (Array.isArray(relationAry) && relationAry[0]) {
				return relationAry[0].name;
			}

		}
		// var curUserId = "";
		$scope.return = function() {
			_hmt.push(['_trackEvent', 'contact_list', 'contact_list_return']);

			$location.path('/toubao_new').search({
				'type': $routeParams.type,
				'choose_plans': $routeParams.choose_plans,
				'user_id': $scope.chooseUser.id,
				coverage_period_type: $routeParams.coverage_period_type,
				coverage_period: $routeParams.coverage_period,
				charge_period_type: $routeParams.charge_period_type,
				charge_period: $routeParams.charge_period
			});


		}
		$scope.choose = function($event, item) {

			_hmt.push(['_trackEvent', 'contact_list', 'contact_list_choose']);
			//列表页，选择用户作为默认用户

			/*
			$scope.data.filter(function(filtedItem){
				return item.id !== filtedItem.id;
			}).forEach( function(element, index) {
				element.is_current = false;
				// statements
			});
			*/

			sessionStorage.setItem("selectUser", item.social_id);

			$scope.chooseUser = item;
			item.is_current = true;
			$location.path('/toubao_new').search({
				'type': $routeParams.type,
				'choose_plans': $routeParams.choose_plans,
				'user_id': item.id,
				coverage_period_type: $routeParams.coverage_period_type,
				coverage_period: $routeParams.coverage_period,
				charge_period_type: $routeParams.charge_period_type,
				charge_period: $routeParams.charge_period
			});
		}

		var openId = sessionStorage.getItem("openId");
		$scope.init = function() {
			$scope.secondPromise = getHttpPromise($http, $rootScope, 'POST', api['recognizee_compile'], {
				'open_id': openId
			}, function(res) {
				if (res && res.data && res.data.data.relations) {
					$scope.data = res.data.data.relations;
					var userSocialId = sessionStorage.getItem("selectUser");
					var defaultRelations = res.data.data.relations.filter(function(item) {
						return item.social_id === userSocialId;
					});
					console.log(defaultRelations);
					if (defaultRelations && defaultRelations.length > 0) {
						$scope.chooseUser = defaultRelations[0];
						$scope.chooseUser.is_current = true;
					} else {
						res.data.data.relations[0].is_current = true;
						$scope.chooseUser = res.data.data.relations[0];
					}
					/*
					var defaultRelations = res.data.data.relations.filter(function(item) {
						return item.default === true;
					});
					if (defaultRelations && defaultRelations.length > 0) {
						//默认选择,数据返回的默认人
						defaultRelations[0].is_current = true;
						$scope.chooseUser = defaultRelations[0];
					} else {
						//如果后台没有默认，选择第一个人
						res.data.data.relations[0].is_current = true;
						$scope.chooseUser = res.data.data.relations[0]
					}*/
				}
			})
		}
		// 跳转and获取资料
		$scope.editUserInfo = function(id) {

			_hmt.push(['_trackEvent', 'contact_list', 'contact_list_edit']);

			$location.path('/update_add_contact').search({
				user_id: id,
				method: "edit",
				choose_plans: $routeParams.choose_plans,
				coverage_period_type: $routeParams.coverage_period_type,
				coverage_period: $routeParams.coverage_period,
				charge_period_type: $routeParams.charge_period_type,
				charge_period: $routeParams.charge_period

			});
		}
		// 跳转and新增被保险人
		$scope.addPeople = function() {
			_hmt.push(['_trackEvent', 'contact_list', 'contact_list_add']);
			$location.path('/update_add_contact').search({
				method: "add",
				'choose_plans': $routeParams.choose_plans,
				coverage_period_type: $routeParams.coverage_period_type,
				coverage_period: $routeParams.coverage_period,
				charge_period_type: $routeParams.charge_period_type,
				charge_period: $routeParams.charge_period
			});
		}
	}
]);
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
					
					var html = [];
					res.localIds.forEach(function(element, index) {
						html.push('<li><img src="' + element + '"></li>');
					});
					$(html.join("")).insertBefore($("#pre_view_image_container").find("li:last"));
					
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