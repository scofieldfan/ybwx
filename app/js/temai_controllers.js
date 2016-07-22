'use strict';

/* Controllers */

var ybwxControllers = angular.module('ybwxControllers', []);



/*保险限制页面*/
ybwxControllers.controller('ybwxProductInfoCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope', 'sharedRestrictions',
  function($scope, $routeParams, $location, $http, $rootScope, sharedRestrictions) {
    $scope.data = sharedRestrictions.getRestrictions();
    console.log(sharedRestrictions.getRestrictions());
    if ($scope.data.health_notice) {
      $scope.data.healths = $scope.data.health_notice.split("\r\n");
    }
    if ($scope.data.extra_notice) {
      $scope.data.extras = $scope.data.health_notice.split("\r\n");
    }
    if ($scope.data.locale_notice) {
      $scope.data.locales = $scope.data.locale_notice.split("\r\n");
    }

    $scope.showTip = function() {
      _hmt.push(['_trackEvent', 'information', 'information_yesBtn']);
      util.showToast($rootScope, "很抱歉，被保险人不满足该产品投保规定。详情请联系诺贝：400-992-0205");
    }
    $scope.goToubao = function() {
      _hmt.push(['_trackEvent', 'information', 'information_subBtn']);
      if(isNew){
          $location.path('/toubao_new').search($routeParams);
      }else{
          $location.path('/tb_dz').search($routeParams);
      }
    }
  }
]);


ybwxControllers.controller('wxTemaiIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $routeParams, $location, $http, $rootScope) {

    util.share({
      shareUrl: "http://web.youbaowuxian.com/#/temaiindex",
      shareImg: "http://web.youbaowuxian.com/img/icon.jpg",
      shareTitle: "诺贝保险管家-特卖商城",
      shareDesc: "严选优质产品，全网低价出售，还有更多福利免费领取！"
    }); //定义本页分享形式
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
    var cellClass = ".cell-footer";
    $scope.goIndex = function($event) {
      //$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
      //$($event.target).parents(cellClass).addClass("hover");
      $location.path('/index').search();
    }
    $scope.goTemai = function($event) {
      //$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
      //$($event.target).parents(cellClass).addClass("hover");
      $location.path('/temaiindex').search();
    }
    $scope.goService = function($event) {
      // $($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
      // $($event.target).parents(cellClass).addClass("hover");
      $location.path('/service').search();
    }
    $("#foucs_button").click(function(event) {
      $(".qrcode-wrapper").show();
      event.preventDefault();
      event.stopPropagation();
    })
    $(".qrcode-container").click(function(event) {
      event.preventDefault();
      event.stopPropagation();
    })
    $(".qrcode-wrapper").click(function(event) {
      $(".qrcode-wrapper").hide();
    })
    $scope.goCategory = function(categoryId) {
      $location.path("/temailist").search({
        "category_id": categoryId
      });
    }
    $scope.goDetail = function(id) {

      $location.path("/temaidetail").search({
        "product_id": id
      });

    }
    $("body").on("click", "#showShare", function() {
      $("#share_ctrl").show();
    })
    $("body").on("click", "#share_ctrl", function() {
      $("#share_ctrl").hide();
    }).on("click", "#opacity_ctrl", function() {
      $("#share_ctrl").hide();
    })
  }
]);
// var product_id = [64];
var newDetailProductId = [64, 94, 18, 100, 22, 9, 128, 67, 68, 86, 38, 39, 49, 37];
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
      $location.path("/temaidetail").search({
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

ybwxControllers.controller('wxDetailNewCtrl', ['$scope', '$q', '$filter', '$routeParams', '$location', '$http', '$rootScope', 'sharedRestrictions',
  function($scope, $q, $filter, $routeParams, $location, $http, $rootScope, sharedRestrictions) {

    _hmt.push(['_trackPageview', $location.path()]);

    $scope.genDanwei = function(type) {
      return coveragePeriodMap[type];
    }
    $scope.gender = 1;

    function updateFee() {
      var openId = sessionStorage.getItem("openId");
      var birthday = $filter('date')($scope.user.birthday, "yyyyMMdd");
      $scope.catePromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurances_sex'], {
        "open_id": openId,
        "insurance_plan_id": $scope.plan.id,
        "birthday": birthday,
        "gender": $scope.gender,
        "coverage_period_type": $scope.coverage_period_type,
        "charge_period_type": $scope.charge_period_type,
        "coverage_period": $scope.coverage_period,
        "charge_period": $scope.charge_period,
      }, function(res) {
        if (res && res.data && res.data.data) {
          $scope.money = res.data.data.premium;
        }
      })
    }
    $scope.init = function() {
      var tmpDate = new Date(1986, 1, 1);
      $scope.user = {
        birthday: tmpDate
      };
      var code = util.getParameterByName("code") || $routeParams.code;

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

      $q.all([$scope.maskPromise, $scope.myPromise]).then(function(res) {
        updateFee();
      }); /**/
    }
    $scope.more = function($event) {
      var element = $event.currentTarget;
      var switchValue = $(element).attr("data-switch");
      if (switchValue === 'on') {
        $(element).siblings().removeClass("ng-hide");
        $(element).find("span").html("收起");
        $(element).attr("data-switch", "off");
        $(element).find(".icon-arrow").addClass("up");
      } else {
        $(element).siblings(":gt(6)").addClass("ng-hide");
        $(element).find("span").html("查看更多");
        $(element).attr("data-switch", "on");
        $(element).find(".icon-arrow").removeClass("up");
      }
    }
    $scope.stopPro = function($event) {
      $event.stopPropagation();
    }
   

    $scope.clickBirthDay = function($event){
       $event.stopPropagation();
      // updateFee();
    }

    $scope.changeBirthday = function($event){
      // $event.stopPropagation();
     //  $event.preventDefault();
       updateFee();
    }


    $scope.changeSex = function($event, gender) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.gender = gender;
      updateFee();
    }

    // console.log($scope.dataNum );
    $scope.changeTaoCan = function($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.plan = item;
      $scope.danwei = genDuration($scope.plan.coverage_period_type);
      //$scope.money = $scope.plan.premium;
      updateFee();
    }

    $scope.changeDuration = function($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.coverage_period = item;
      updateFee();
    }

    $scope.changeFee = function($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.charge_period = item;
      updateFee();
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
        //解决浮层滑动时body滑动
        $('body').css("overflow","hidden")
      } else {
        $scope.submit();
      }
    }
    $scope.submit = function() {
      //获得当前的plan
      var selectPlan = $scope.plan.id;

      var postData = {
        "plan_id": selectPlan,
        "choose_plans": JSON.stringify([selectPlan])
      };

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
       if (isNew) {
          $location.path("/toubao_new").search(postData);
        } else {
          $location.path("/tb_dz").search(postData);
        }
       /* 
      if ($scope.data.health_notice || $scope.data.extra_notice || $scope.data.locale_notice) {
        $location.path("/productinformation").search(postData);
      } else {
       
      }*/
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