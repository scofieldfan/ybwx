'use strict';

/* Controllers */

var ybwxControllers = angular.module('ybwxControllers', []);

ybwxControllers.controller('wxTemaiIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $routeParams, $location, $http, $rootScope) {



  }
 ]);
ybwxControllers.controller('wxListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $routeParams, $location, $http, $rootScope) {
    _hmt.push(['_trackPageview', $location.path()]);


    //setTest($routeParams.is_test);
    $scope.isHaveResult = true;

    util.share({
              shareUrl:"http://web.youbaowuxian.com/#/list"
    });

    $scope.getList = function(insurances_type) {
      $scope.isHaveResult = true;
      var openId = sessionStorage.getItem("openId");
      $scope.insurances_type = insurances_type;
      $scope.listPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurances_selling'], {
        "insurance_type": insurances_type,
        "open_id": openId
      }, function(res) {
        console.log(res);
        if (res && res.data && res.data.data) {
          $scope.list = res.data.data.insurances;
          if (res.data.data.insurances && 　res.data.data.insurances.length > 0) {
            $scope.isHaveResult = true;
          } else {
            $scope.isHaveResult = false;
          }
        }
      })
    }

    $scope.init = function() {
      var code = util.getParameterByName("code");
      if (!code) {
        code = $routeParams.code;
      }
      util.getOpenId(code).then(function() {
        $scope.getList(4);
      });

    }
    $scope.goDetail = function(id) {
      $location.path("/detail").search({
        "product_id": id
      });
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
ybwxControllers.controller('wxDetailNewCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope', '$sce',
  function($scope, $routeParams, $location, $http, $rootScope, $sce) {


   
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
             $(".tail-container").load("template/new/product_" + $routeParams.product_id + ".html");
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
              shareUrl:"http://web.youbaowuxian.com/#/detail?product_id="+$routeParams.product_id,
              shareImg: $scope.data.small_image,
              shareTitle: $scope.data.insurance_name,
              shareDesc:$scope.data.insurance_description
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
      console.log($scope.data);
      var selectPlan = $scope.plan.id;


      /*
      if ($scope.plan.coverage_period_type === 5) {
        $scope.danwei = $scope.plan.coverage_period + "天";
      }
      if ($scope.plan.coverage_period_type === 2) {
        $scope.danwei = $scope.plan.coverage_period + "年";
      }*/
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

ybwxControllers.controller('wxDetailCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope', '$sce',
  function($scope, $routeParams, $location, $http, $rootScope, $sce) {

    
    $("#detail-template").load("template/product_" + $routeParams.product_id + ".html");

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
              shareUrl:"http://web.youbaowuxian.com/#/detail?product_id="+$routeParams.product_id,
              shareImg: $scope.data.small_image,
              shareTitle: $scope.data.insurance_name,
              shareDesc:$scope.data.insurance_description
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


      /*
      if ($scope.plan.coverage_period_type === 5) {
        $scope.danwei = $scope.plan.coverage_period + "天";
      }
      if ($scope.plan.coverage_period_type === 2) {
        $scope.danwei = $scope.plan.coverage_period + "年";
      }*/
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
    }else{
       $scope.isHaveOffical = false;
    }

    //测试
    /*
    var isTest =  sessionStorage.getItem("is_test");
    if (isTest === 'true' ) {
      $scope.order_amount = 1;
    }*/

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


/*
ybwxControllers.controller('ybwxPaySelectCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $filter, $routeParams, $location, $http, $rootScope) {

    _hmt.push(['_trackPageview', $location.path()]);
    $scope.insurance_name = $routeParams.insurance_name;
    $scope.insurance_plan_name = $routeParams.insurance_plan_name;
    $scope.order_amount = $routeParams.order_amount;

    //测试
    var isTest =  sessionStorage.getItem("is_test");
    if (isTest === 'true' ) {
      $scope.order_amount = 1;
    }

    //$scope.order_amount = 1;
    $scope.order_id = $routeParams.order_id;
    $scope.order_no = $routeParams.order_no;

    $scope.submit = function() {
      //console.log("submit....");
      _hmt.push(['_trackEvent', 'pay_subBtn']);
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
    $scope.pay = function($event) {
      //获取支付信息
      if ($event) {
        var element = $event.currentTarget;
        $(".pay_item").removeClass("choose");
        $(element).addClass("choose");
      }
      var openId = sessionStorage.getItem("openId");
      var channelType = $(".pay_container").find(".choose").attr("data-channel-type");
      _hmt.push(['_trackEvent', 'pay_select_' + channelType]);
      if (channelType == "1" && $scope.redirectUrl) {
        return;
      }
      if (channelType == "3" && $scope.ipaynow_pay_request) {
        return;
      }
      $http({
        method: 'POST',
        headers: {
          "Content-Type": "application/json;charset:UTF-8"
        },
        url: api['pay'],
        data: {
          open_id: openId,
          order_id: $scope.order_id,
          pay_channel_type: channelType,
          order_amount: $scope.order_amount
        }
      }).then(function(res) {
        console.log(res);
        if (res && res.data && res.data.data && res.data.code === 0) {
          if (channelType == "1") { //银行卡
            $scope.redirectUrl = res.data.data.pp_response.pp_url;
          } else if (channelType == "3") { //现在支付微信
            $scope.ipaynow_pay_request = res.data.data.ipaynow_pay_request;
          }
        } else {
          util.showToast($rootScope, res.data.reason);
        }
      }, function(res) {
        console.log(res);
        util.showToast($rootScope, res.description);
      });
    }
    $scope.pay();
  }
]);

*/


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



/*
ybwxControllers.controller('ybwxLoginCtrl', ['$scope', 'YbwxLogin', '$cookies','$location','$interval',
  function($scope, YbwxLogin, $cookies,$location,$interval) {

    $scope.submit_server_reason = "";
    $cookies.put("234234xx","xxxx");
    console.log($cookies.get("JSESSIONID"));
    if ($cookies.get("JSESSIONID")) {
      $scope.submit_server_reason = "已经登录成功";
    }
    $scope.login = function() {
      if ($scope.loginform.$invalid) {
        return false;
      }
       $scope.submit_server_reason = "正在登录，请稍等";
      YbwxLogin.save($scope.user, {}, function(resp) {
        // 
         redirectIndex($scope,$interval,$location,"登录成功");

      }, function(err) {
        console.log(err);
        console.log(err.status);
        if(err){
            if(err.status===401){
                 $scope.submit_server_reason = "用户名，密码错误。请重新输入";
            }else{
                 $scope.submit_server_reason = "服务器端错误";
            }
        }
      });
    }
    
  }
]);

function redirectIndex($scope,$interval,$location,successReason){

      var time = 5;
      var timer = $interval(function() {
        time--;
        $scope.submit_server_reason = successReason+time + "秒后跳转首页";
        if (time === 0) {
          $scope.submit_server_reason =successReason + ",跳转首页";
          $interval.cancel(timer);
           //location.href = "/#/index";
           $location.path('/index');
        }
      }, 1000)
}
ybwxControllers.controller('ybwxRegCtrl', ['$scope', '$interval', 'PhoneVerCode', 'register','$location',
  function($scope, $interval, PhoneVerCode, register,$location) {

    $scope.status = "获取验证码";
    $scope.vercode_server_reason = "";
    $scope.submit_server_reason = "";
    $scope.isWaiting = false;
    // Function to replicate setInterval using $timeout service.
    $scope.intervalFunction = function() {
      if ($scope.isWaiting || ($scope.registration.mobile.$invalid)) {
        return false;
      }
      PhoneVerCode.get({
        "mobile": $scope.user.mobile
      }, function(resp) {
        console.log(resp);
        if (resp.description) {
          $scope.vercode_server_reason = "验证码,服务端错误.";
        }
      }, function(err) {
        $scope.vercode_server_reason = "验证码,服务器端错误";
      });
      var time = 30;
      var timer = $interval(function() {
        $scope.isWaiting = true;
        time--;
        $scope.status = time + "秒";
        if (time === 0) {
          $scope.status = "获取验证码";

          $interval.cancel(timer);
          $scope.isWaiting = false;
        }
      }, 1000)
    };
   
    $scope.sendVerify = function() {
      $scope.intervalFunction();
    }
    $scope.submit = function() {
      console.log("is form Ok?" + !$scope.registration.$invalid);
      if (!$scope.registration.$invalid) {
        console.log($scope.user);
        register.get($scope.user, function(resp) {
          if (resp.code === 10000) {
            $scope.submit_server_reason = "验证码已被使用，请重新发送验证码";
          }
          console.log(resp);
          if (resp.code === 0) {
             redirectIndex($scope,$interval,$location,"注册成功");
            //success
            //  显示注册成功
            // location.href = "/#/login";
          }
        }, function(err) {

          $scope.submit_server_reason = "服务器端错误";

        });
      }
    }
  }
]);

*/


/*
function newOption(name) {
  return {
    id: '-1',
    name: '请选择' + name + '级职业分类'
  }
}


ybwxControllers.controller('ybwxToubaoCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $filter, $routeParams, $location, $http, $rootScope) {

    $scope.money = $routeParams.money;
    $scope.danwei = $routeParams.danwei;
    $scope.isNeedJob = $routeParams.isNeedJob;



    function getFirstJob() {
      $http({
        method: 'GET',
        headers: {
          "Content-Type": "application/json;charset:UTF-8"
        },
        url: api['get_industries_1']
      }).then(function(res) {
        console.log(res);
        if (res && res.data && res.data.data) {
          $scope.data.availableOptions_1 = res.data.data.industries.slice();
          $scope.data.availableOptions_1.unshift(newOption("一"));
          $scope.data.selectedOption_1 = newOption("一");
          $scope.data.availableFamilyOptions_1 = res.data.data.industries.slice();
          $scope.data.availableFamilyOptions_1.unshift(newOption("一"));
          $scope.data.selectedFamilyOption_1 = newOption("一");
        }
      }, function(res) {
        console.log(res);
        util.showToast($rootScope, "服务器错误");
      })
    }

    function baseGetSecondJob(firstJobid, callback) {
      $http({
        method: 'GET',
        headers: {
          "Content-Type": "application/json;charset:UTF-8"
        },
        url: api['get_industries_2'] + firstJobid
      }).then(function(res) {
        console.log(res);
        if (res && res.data && res.data.data) {
          callback(res);
        }
      });
    }

    function baseGetThirdJob(secondJobid, callback) {
      $http({
        method: 'GET',
        headers: {
          "Content-Type": "application/json;charset:UTF-8"
        },
        url: api['get_industries_3'] + secondJobid

      }).then(function(res) {
        console.log(res);
        if (res && res.data && res.data.data) {
          callback(res);
        }
      });
    }

    $scope.getSecondJob = function() {
      baseGetSecondJob($scope.data.selectedOption_1.id, function(res) {
        $scope.data.availableOptions_2 = res.data.data.occupations;
        $scope.data.availableOptions_2.unshift(newOption("二"));
        $scope.data.selectedOption_2 = newOption("二");
      });
    }
    $scope.getThirdJob = function() {
      baseGetThirdJob($scope.data.selectedOption_2.id, function(res) {
        $scope.data.availableOptions_3 = res.data.data.jobs;
        $scope.data.availableOptions_3.unshift(newOption("三"));
        $scope.data.selectedOption_3 = newOption("三");
      });
    }
    $scope.getFamilySecondJob = function() {
      baseGetSecondJob($scope.data.selectedFamilyOption_1.id, function(res) {
        $scope.data.availableFamilyOptions_2 = res.data.data.occupations;
        $scope.data.availableFamilyOptions_2.unshift(newOption("二"));
        $scope.data.selectedFamilyOption_2 = newOption("二");
      });
    }
    $scope.getFamilyThirdJob = function() {
      baseGetThirdJob($scope.data.selectedFamilyOption_2.id, function(res) {
        $scope.data.availableFamilyOptions_3 = res.data.data.jobs;
        $scope.data.availableFamilyOptions_3.unshift(newOption("三"));
        $scope.data.selectedFamilyOption_3 = newOption("三");
      });
    }

    $scope.init = function() {
      $scope.data = {
        availableOptions_2: [newOption("二")],
        selectedOption_2: newOption("二"),
        availableOptions_3: [newOption("三")],
        selectedOption_3: newOption("三"),
        availableFamilyOptions_2: [newOption("二")],
        selectedFamilyOption_2: newOption("二"),
        availableFamilyOptions_3: [newOption("三")],
        selectedFamilyOption_3: newOption("三")
      };
      $scope.user = getUserInfo();
      getFirstJob();
      $scope.params = $routeParams;
      var testDate = new Date();
      testDate.setDate(testDate.getDate() + 1);
      $scope.minDate = testDate;
      $scope.user.effective_date = testDate;
      $scope.know_contract = true;
    }

    function baseValid() {
      if ($scope.order.username.$invalid) {
        util.showToast($rootScope, "姓名不正确");
        return false;
      }
      if ($scope.order.social_id.$invalid) {
        util.showToast($rootScope, "身份证号不正确");
        return false;
      }
      if ($scope.order.mobile.$invalid) {
        util.showToast($rootScope, "手机号不正确");
        return false;
      }

      if ($scope.order.effective_date.$invalid) {
        util.showToast($rootScope, "保险生效时间不正确");
        return false;
      }
      if ($scope.order.ineffective_date.$invalid) {
        util.showToast($rootScope, "保险终止时间不正确");
        return false;
      }
      return true;
    }

    function validJob(item) {
      if (parseInt($scope.isNeedJob) === 1) {
        if (item && item.id === "-1") {
          util.showToast($rootScope, "被保人职业选择不正确");
          return false;
        }
      }
      return true;
    }

    function forSelfSpecial() {
      return validJob($scope.data.selectedOption_3);
    }



    function familyValid() {
      if ($scope.order.insurance_username.$invalid) {
        util.showToast($rootScope, "被保人姓名不正确");
        return false;
      }
      if ($scope.order.insurance_social_id.$invalid) {
        util.showToast($rootScope, "被保人身份证不正确");
        return false;
      }
      if ($scope.order.insurance_mobile.$invalid) {
        util.showToast($rootScope, "被保人手机号不正确");
        return false;
      }
      if (!validJob($scope.data.selectedFamilyOption_3)) {
        return false;
      }
      return true;
    }

    function getResponse(res) {
      return {
        "insurance_name": res.data.data.insurance_name,
        "insurance_plan_name": res.data.data.insurance_plan_name,
        "order_amount": res.data.data.order_amount,
        "order_id": res.data.data.order_id,
        "order_no": res.data.data.order_no
      }
    }
    $scope.submitbt = function() {
      var openId = sessionStorage.getItem("openId");

      var dataFor = $("#select_toubao").find(".btn_n_primary").attr("data-for") == "self" ? 1 : 2;
      var effectiveDate = $filter('date')($scope.user.effective_date, "yyyyMMdd");
      // var ineffectiveDate = $filter('date')($scope.user.ineffective_date, "yyyyMMdd");
      var plans_to_premium = {};
      plans_to_premium[$routeParams["select-plan"]] = $scope.money;
      var postData = {
        open_id: openId,
        name: $scope.user.username,
        social_id: $scope.user.social_id,
        mobile: $scope.user.mobile,
        plans_to_premium: plans_to_premium,
        //insurance_plan_id: $routeParams["select-plan"],
        //order_amount: $scope.money,
        insure_type: dataFor,
        effective_date: effectiveDate
      };
      var isValid = false;
      if (parseInt($scope.isNeedJob) === 1) {
        postData["job_id"] = $scope.data.selectedOption_3.id;
      }
      if (dataFor == 1) {
        //为自己
        if (baseValid() && forSelfSpecial()) {
          isValid = true;
        }
      } else {
        //为家人
        if (baseValid() && familyValid()) {
          postData["insured_peoples"] = [{
            "name": $scope.family.insurance_username,
            "mobile": $scope.family.insurance_mobile,
            "social_id": $scope.family.insurance_social_id,
            "job_id": $scope.data.selectedFamilyOption_3.id
          }]
          isValid = true;
        }
      }
      if (isValid) {
        $http({
          method: 'POST',
          headers: {
            "Content-Type": "application/json;charset:UTF-8"
          },
          url: api['insure'],
          data: postData
        }).then(function(res) {
          console.log(res);
          if (res && res.data && res.data.data) {
            saveUserInfo($scope.user.username, $scope.user.social_id, $scope.user.mobile);
            $location.path("/pay_select").search(getResponse(res));
          } else {
            util.showToast($rootScope, res.data.description);
          }
        }, function(res) {
          console.log(res);
          util.showToast($rootScope, "服务器错误");
        });
      }
    }
  }
]);
*/