'use strict';

/* Controllers */

var ybwxControllers = angular.module('ybwxControllers', []);



ybwxControllers.controller('ybwxProductInfoCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $routeParams, $location, $http, $rootScope) {


  }
]);
ybwxControllers.controller('wxTemaiIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $routeParams, $location, $http, $rootScope) {

    util.share({
              shareUrl: "http://web.youbaowuxian.com/#/temaiindex",
              shareImg: "http://web.youbaowuxian.com/img/icon.jpg",
              shareTitle: "诺贝保险管家-特卖商城",
              shareDesc: "严选优质产品，全网低价出售，还有更多福利免费领取！"
    });//定义本页分享形式
    $scope.loadReady = false;
    var code = util.getParameterByName("code") || $routeParams.code;
    util.getOpenId(code).then(function() {
      var openId = sessionStorage.getItem("openId");
      $scope.listPromise = getHttpPromise($http, $rootScope, 'POST', api['temai_index'], {
        "open_id": openId
      }, function(res) {
        if (res && res.data && res.data.data) {
          $scope.categorys = res.data.data.categorys;
        }
         $scope.loadReady = true;
      })
    });
    var cellClass=".cell-footer";
    $scope.goIndex = function($event){
      //$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
      //$($event.target).parents(cellClass).addClass("hover");
      $location.path('/index').search();
    }
    $scope.goTemai = function($event){
      //$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
      //$($event.target).parents(cellClass).addClass("hover");
      $location.path('/temaiindex').search();
    }
    $scope.goService = function($event){
     // $($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
     // $($event.target).parents(cellClass).addClass("hover");
      $location.path('/service').search();
    }
      $("#foucs_button").click(function(event){
        $(".qrcode-wrapper").show();
        event.preventDefault();
        event.stopPropagation();
     })
      $(".qrcode-container").click(function(event){
         event.preventDefault();
         event.stopPropagation();
     })
      $(".qrcode-wrapper").click(function(event){
       $(".qrcode-wrapper").hide();
     })
    $scope.goCategory = function(categoryId) {
      $location.path("/temailist").search({
        "category_id": categoryId
      });
    }
    $scope.goDetail = function(id) {
     // var product_id = [64];
      if (newDetailProductId.indexOf(id) !== -1) {
        $location.path("/temaidetail").search({
          "product_id": id
        });
      } else {
        $location.path("/detail").search({
          "product_id": id
        });
      }
    }
    $("body").on("click","#showShare",function(){
      $("#share_ctrl").show();
    })
    $("body").on("click", "#share_ctrl", function() {
      $("#share_ctrl").hide();
     }).on("click","#opacity_ctrl",function() {
      $("#share_ctrl").hide();
     })
  }
]);
// var product_id = [64];
var newDetailProductId = [64,94,18,100,22,9];
/*特卖list*/
ybwxControllers.controller('wxTemaiListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $routeParams, $location, $http, $rootScope) {



    $scope.isHaveResult = true;

    util.share({
      shareUrl: "http://web.youbaowuxian.com/#/temailist"
    });

    $scope.getNav = function() {
      $scope.isHaveResult = true;
      var openId = sessionStorage.getItem("openId");
      $scope.listPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurance_category'], {
        "open_id": openId
      }, function(res) {
        console.log('tailu........');
        console.log(res);
        console.log('tailu........');
        if (res && res.data && res.data.data) {
          $scope.navItems = res.data.data.categories;
        } else {
          $scope.isHaveResult = false;
        }
      })
    }
    $scope.getCateList = function(category_id) {
      var openId = sessionStorage.getItem("openId");
      $scope.category_id = category_id;
      $scope.catePromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurance_category_insurance'], {
        "category_id": category_id,
        "open_id": openId
      }, function(res) {
        if (res && res.data && res.data.data) {
          $scope.cateItems = res.data.data.insurances;
        }
      })
    }
    $scope.init = function() {
      var code = util.getParameterByName("code") || $routeParams.code;
      var defaultCategory = $routeParams.category_id || 3;
      util.getOpenId(code).then(function() {
        $scope.getNav();
        $scope.getCateList(defaultCategory);
      });
    }
   
    $scope.goCateDetail = function(id) {
      if (newDetailProductId.indexOf(id) !== -1) {
        $location.path("/temaidetail").search({
          "product_id": id
        });
      } else {
        $location.path("/detail").search({
          "product_id": id
        });
      }
    }
  }
]);

function genDuration(type) {
  if (type === 5) {
    return "天";
  }
  if (type === 2) {
    return "年";
  }
}
var coveragePeriodMap = {
  1: "保终身",
  2: "年",
  3: "岁",
  4: "月",
  5: "天"
}

ybwxControllers.controller('wxDetailNewCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope', '$sce', 'sharedRestrictions',
  function($scope, $routeParams, $location, $http, $rootScope, $sce, sharedRestrictions) {

    _hmt.push(['_trackPageview', $location.path()]);

    $scope.genDanwei = function(type) {
      return coveragePeriodMap[type];
    }
    $scope.init = function() {


      var code = util.getParameterByName("code");
      if (!code) {
        code = $routeParams.code;
      };


      util.getOpenId(code).then(function() {

        $scope.haveMask = false;
        $scope.selectTable = 0;
        $scope.maskPromise = getHttpPromise($http, $rootScope, 'GET', api['get_insurances_mask'].replace("{productId}", $routeParams.product_id), {}, function(res) {

          if (res.data && res.data.data && res.data.data.plans) {
            $scope.maskPlans = res.data.data.plans;
            $scope.maskSelectPlan = $scope.maskPlans[Object.keys($scope.maskPlans)[0]];
            $scope.coverage_period = $scope.maskSelectPlan.coverage_periods[0];
            $scope.coverage_period_type = $scope.maskSelectPlan.coverage_period_type;

            if ($scope.maskSelectPlan.charge_periods) {
              $scope.charge_period = $scope.maskSelectPlan.charge_periods[0];
            }
            $scope.charge_period_type = $scope.maskSelectPlan.charge_period_type;
            $scope.haveMask = true;
          } else {
            $scope.haveMask = false;
          }

        })

        $scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurances_detail'], {
          "insurance_id": $routeParams.product_id
        }, function(res) {

          if (res && res.data && res.data.data) {
            $(".tail-container").load("template/new/product_" + $routeParams.product_id + ".html");
            for (var i = 0; i < res.data.data.insurance_plans.length; i++) {
              var plan = res.data.data.insurance_plans[i];
              for (var j = 0; j < plan.coverage_beans.length; j++) {
                if (plan.coverage_beans[j].sum_insured.charAt(plan.coverage_beans[j].sum_insured.length - 1) === "d") {
                  plan.coverage_beans[j].danwei = "/天";
                  plan.coverage_beans[j].sum_insured = plan.coverage_beans[j].sum_insured.substring(0, plan.coverage_beans[j].sum_insured.length - 1);
                }
              }


              console.log();
              plan.main_coverage_beans = plan.coverage_beans.filter(function(item) {
                return item.coverage_type == 1;
              });
              plan.second_coverage_beans = plan.coverage_beans.filter(function(item) {
                return item.coverage_type == 2;
              });

            }
            if (res.data.data.coverage_overview) {
              $scope.coverage_overviews = res.data.data.coverage_overview.split("##");
            }
            sharedRestrictions.setRestrictions({
              health_notice: res.data.data.health_notice,
              extra_notice: res.data.data.extra_notice,
              locale_notice: res.data.data.locale_notice
            })
            $scope.data = res.data.data;
            $scope.money = res.data.data.insurance_plans[0].premium;
            $scope.plan = res.data.data.insurance_plans[0];
            $scope.danwei = genDuration($scope.plan.coverage_period_type);
            util.share({
              shareUrl: "http://web.youbaowuxian.com/#/temaidetail?product_id=" + $routeParams.product_id,
              shareImg: $scope.data.small_image,
              shareTitle: $scope.data.insurance_name,
              shareDesc: $scope.data.insurance_description
            });

          }

        });

      })
    }
    $scope.more = function($event) {
      var element = $event.currentTarget;
      var switchValue = $(element).attr("data-switch");
      if (switchValue === 'on') {
        $(element).siblings().removeClass("ng-hide");
        $(element).find("span").html("收起");
        $(element).attr("data-switch", "off");
        $(element).find("img").addClass("up");
      } else {
        $(element).siblings(":gt(6)").addClass("ng-hide");
        $(element).find("span").html("查看更多");
        $(element).attr("data-switch", "on");
        $(element).find("img").removeClass("up");
      }
    }
    $scope.changeTaoCan = function($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.plan = item;
      $scope.danwei = genDuration($scope.plan.coverage_period_type);
      $scope.money = $scope.plan.premium;
    }
    $scope.changeDuration = function($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.coverage_period = item;
    }
    $scope.changeFee = function($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.charge_period = item;
    }
    $scope.headSelect = function($event, plan) {
      var element = $event.currentTarget;
      $(".btn-container").find("a").removeClass("weui_btn_primary")
      $(element).addClass("weui_btn_primary");
      var index = $(element).attr("data-index");
      $scope.selectTable = index;
      // $("#title-table").attr("data-current-select-id", plan.id);
      //console.log($(element));
      $scope.plan = plan;
      $scope.danwei = genDuration($scope.plan.coverage_period_type);
      $scope.money = plan.premium;
    }
    /*
    Coverage_Period_Type:
      (0, "保障期间类型未知"),
      (1, "保终身"),
      (2, "按年保"),
      (3, "按年龄限保"),
      (4, "按月保"),
      (5, "按天保");*/

    $scope.showMask = function() {
      if ($scope.haveMask) {
        $("#detail_mask_container").show();
      } else {
        $scope.submit();
      }
    }
    $scope.submit = function() {
      //获得当前的plan
      var selectPlan = $scope.plan.id;

      var postData = {
        "from": "list",
        "plan_id": selectPlan
      };
      if ($routeParams.is_test) {
        postData["is_test"] = $routeParams.is_test;
      }
      if ($scope.coverage_period_type) {
        postData["coverage_period_type"] = $scope.coverage_period_type;
      };
      if ($scope.charge_period_type) {
        postData["charge_period_type"] = $scope.charge_period_type;
      };

      if ($scope.coverage_period) {
        postData["coverage_period"] = $scope.coverage_period;
      };
      if ($scope.charge_period) {
        postData["charge_period"] = $scope.charge_period;
      }

      if ($scope.data.health_notice || $scope.data.extra_notice || $scope.data.locale_notice) {
        $location.path("/productinformation").search(postData);
      } else {
        $location.path("/tb_dz").search(postData);
      }

    }
  }
]);

ybwxControllers.controller('wxDetailCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope', '$sce',
  function($scope, $routeParams, $location, $http, $rootScope, $sce) {


    $("#detail-template").load("template/product_" + $routeParams.product_id + ".html");

    _hmt.push(['_trackPageview', $location.path() + "_id:" + $routeParams.product_id + "_" + "from:" + $routeParams.from]);



    $scope.genDanwei = function(type) {
      return coveragePeriodMap[type];
    }
    $scope.init = function() {


      var code = util.getParameterByName("code");
      if (!code) {
        code = $routeParams.code;
      };

      util.getOpenId(code).then(function() {

        $scope.haveMask = false;
        $scope.selectTable = 0;
        $scope.maskPromise = getHttpPromise($http, $rootScope, 'GET', api['get_insurances_mask'].replace("{productId}", $routeParams.product_id), {}, function(res) {

          if (res.data && res.data.data && res.data.data.plans) {
            console.log(".................");
            console.log(res.data.data.plans);
            $scope.maskPlans = res.data.data.plans;
            $scope.maskSelectPlan = $scope.maskPlans[Object.keys($scope.maskPlans)[0]];
            $scope.coverage_period = $scope.maskSelectPlan.coverage_periods[0];
            $scope.coverage_period_type = $scope.maskSelectPlan.coverage_period_type;
            if ($scope.maskSelectPlan.charge_periods) {
              $scope.charge_period = $scope.maskSelectPlan.charge_periods[0];
            }
            $scope.charge_period_type = $scope.maskSelectPlan.charge_period_type;

            $scope.haveMask = true;
          } else {
            $scope.haveMask = false;
          }

        })



        $scope.myPromise = $http({
          method: 'POST',
          headers: {
            "Content-Type": "application/json;charset:UTF-8"
          },
          url: api['get_insurances_detail'],
          data: {
            "insurance_id": $routeParams.product_id
          }
        }).then(function(res) {
          console.log(res);
          if (res && res.data && res.data.data) {
            for (var i = 0; i < res.data.data.insurance_plans.length; i++) {
              var plan = res.data.data.insurance_plans[i];
              for (var j = 0; j < plan.coverage_beans.length; j++) {
                if (plan.coverage_beans[j].sum_insured.charAt(plan.coverage_beans[j].sum_insured.length - 1) === "d") {
                  plan.coverage_beans[j].danwei = "/天";
                  plan.coverage_beans[j].sum_insured = plan.coverage_beans[j].sum_insured.substring(0, plan.coverage_beans[j].sum_insured.length - 1);
                }
              }
            }
            $scope.data = res.data.data;
            $scope.money = res.data.data.insurance_plans[0].premium;
            $scope.plan = res.data.data.insurance_plans[0];
            $scope.danwei = genDuration($scope.plan.coverage_period_type);

            util.share({
              shareUrl: "http://web.youbaowuxian.com/#/detail?product_id=" + $routeParams.product_id,
              shareImg: $scope.data.small_image,
              shareTitle: $scope.data.insurance_name,
              shareDesc: $scope.data.insurance_description
            });

          }
        }, function(res) {
          console.log(res);
          util.showToast($rootScope, "服务器错误");
        })

      })
    }



    $scope.changeTaoCan = function($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.plan = item;
      $scope.danwei = genDuration($scope.plan.coverage_period_type);
      $scope.money = $scope.plan.premium;
    }
    $scope.changeDuration = function($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.coverage_period = item;
    }
    $scope.changeFee = function($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.charge_period = item;
    }
    $scope.headSelect = function($event, plan) {
      var element = $event.currentTarget;
      $("#title-table").find("td").removeClass("choose")
      $(element).addClass("choose");
      var index = $(element).attr("data-index");
      $scope.selectTable = index;
      // $("#title-table").attr("data-current-select-id", plan.id);
      //console.log($(element));
      $scope.plan = plan;
      $scope.danwei = genDuration($scope.plan.coverage_period_type);
      $scope.money = plan.premium;
    }
    /*
    Coverage_Period_Type:
      (0, "保障期间类型未知"),
      (1, "保终身"),
      (2, "按年保"),
      (3, "按年龄限保"),
      (4, "按月保"),
      (5, "按天保");*/

    $scope.showMask = function() {
      if ($scope.haveMask) {
        $("#detail_mask_container").show();
      } else {
        $scope.submit();
      }
    }
    $scope.submit = function() {
      //获得当前的plan
      console.log($scope.data);
      var selectPlan = $scope.plan.id;


 
      var postData = {
        "from": "list",
        "plan_id": selectPlan
      };
      if ($routeParams.is_test) {
        postData["is_test"] = $routeParams.is_test;
      }
      if ($scope.coverage_period_type) {
        postData["coverage_period_type"] = $scope.coverage_period_type;
      };
      if ($scope.charge_period_type) {
        postData["charge_period_type"] = $scope.charge_period_type;
      };

      if ($scope.coverage_period) {
        postData["coverage_period"] = $scope.coverage_period;
      };
      if ($scope.charge_period) {
        postData["charge_period"] = $scope.charge_period;
      }


      $location.path("/tb_dz").search(postData);
    }
  }
]);
ybwxControllers.controller('ybwxPaySelectNewCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $filter, $routeParams, $location, $http, $rootScope) {



    _hmt.push(['_trackPageview', $location.path()]);

    $scope.plans = {};
    $scope.insurance_name = $routeParams.insurance_name;
    $scope.insurance_plan_name = $routeParams.insurance_plan_name;
    $scope.order_amount = $routeParams.order_amount;

    $scope.plans = JSON.parse(sessionStorage.getItem("sell_plan"));


    if ($scope.plans) {
      $scope.isHaveOffical = $scope.plans.some(function(item) {
        return !item.premium;
      });
    } else {
      $scope.isHaveOffical = false;
    }

   

    function setPayInfo(orderId, channelType, info) {
      sessionStorage.setItem(orderId + "_" + channelType, JSON.stringify(info));
    }

    function getPayInfo(orderId, channelType) {
      return JSON.parse(sessionStorage.getItem(orderId + "_" + channelType));
    }


    //$scope.order_amount = 1;
    $scope.order_id = $routeParams.order_id;
    $scope.order_no = $routeParams.order_no;

    $scope.submit = function() {
      //console.log("submit....");
      _hmt.push(['_trackEvent', 'pay', 'pay_subBtn']);
      var channelType = $(".pay_container").find(".choose").attr("data-channel-type");

      if (channelType == "1") { //银行卡支付
        if ($scope.redirectUrl) {

          window.location.href = $scope.redirectUrl;
        } else {
          util.showToast($rootScope, "银行卡支付出错，暂时无法使用");
        }
        //   window.location.href =  $scope.redirectUrl;
      } else if (channelType == "3") { //现在支付微信
        document.getElementById("wechatPayForm").submit();
      }

    }
    $scope.ajaxPayInfo = function(channelType) {
      var openId = sessionStorage.getItem("openId");
      $scope.payPromise = getHttpPromise($http, $rootScope, 'POST', api['pay'], {
        open_id: openId,
        order_id: $routeParams.order_id,
        pay_channel_type: channelType,
        order_amount: $routeParams.order_amount
      }, function(res) {
        console.log(res);
        if (res && res.data && res.data.data && res.data.code === 0) {
          if (channelType == "1") { //银行卡
            $scope.redirectUrl = res.data.data.pp_response.pp_url;
            setPayInfo($routeParams.order_id, "1", $scope.redirectUrl)
          } else if (channelType == "3") { //现在支付微信
            $scope.ipaynow_pay_request = res.data.data.ipaynow_pay_request;
            setPayInfo($routeParams.order_id, "3", $scope.ipaynow_pay_request)
          }
        } else {
          util.showToast($rootScope, res.data.reason);
        }
      })
    }
    $scope.pay = function($event) {
      //获取支付信息
      if ($event) {
        var element = $event.currentTarget;
        $(".pay_item").removeClass("choose");
        $(element).addClass("choose");
      }
      var channelType = $(".pay_container").find(".choose").attr("data-channel-type");
      _hmt.push(['_trackEvent', 'pay', 'pay_select' + channelType]);
    }
    var url = getPayInfo($routeParams.order_id, "1");
    var ipayNowRequest = getPayInfo($routeParams.order_id, "3")
    if (url) {
      $scope.redirectUrl = url;
    } else {
      $scope.ajaxPayInfo("1");
    }
    if (ipayNowRequest) {
      $scope.ipaynow_pay_request = ipayNowRequest;
    } else {
      $scope.ajaxPayInfo("3");
    }


  }
]);




ybwxControllers.controller('ybwxSuccessCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $filter, $routeParams, $location, $http, $rootScope) {

    _hmt.push(['_trackPageview', $location.path()]);
    //sessionStorage
    //$scope.orderId = $location.search().order_no;
    $scope.send_bd = function() {
      if (!sendForm.email.$invalid) {
        var openId = sessionStorage.getItem("openId");
        util.sendMail($http, $rootScope, api['send_bd'], openId, $scope.user.email, $location.search().order_no);

      }
    }
    $scope.goList = function() {
      window.location.href = "wx_list.html";
    }
    $scope.showShareTip = function() {
      shareTip();
    }
  }
]);
