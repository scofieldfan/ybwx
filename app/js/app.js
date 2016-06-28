'use strict';

/* App Module */

var ybwxApp = angular.module('ybwxApp', [
  'ngRoute',
  'ngCookies',
  'cgBusy',
  'ybwx-directives',
  'ybwxControllers',
  'mainControllers',
  'baodanControllers',
  'routeStyles'
]).value('cgBusyDefaults', {
  message: '正在加载....',
  templateUrl: 'template/loading.html'
});

ybwxApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
});
ybwxApp.filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
});
ybwxApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/index', {
      templateUrl: 'partials/index_part.html?v=123',
      controller: 'ybwxIndexCtrl',
      title: '诺贝保险管家'
    }).when('/bd_education', {
      templateUrl: 'partials/bd_education.html',
      controller: 'ybwxBdEducationCtrl',
      title: "保障评分",
      css:'css/bd_education.css?rev=03e9859471029a5f6a25100d5fe26d68'
    }).when('/select', {
      templateUrl: 'partials/select_part.html?v=123',
      controller: 'ybwxSelectCtrl',
      title: "保障提升",
      css:'css/ring.css?rev=891200b47864c2f327697002745b1f0d'
    }).when('/bz', {
      templateUrl: 'partials/bz_list.html?v=123',
      controller: 'ybwxBzCtrl',
      title: "定制保障说明",
      css:'css/bz.css?rev=0005babc7ee4d53dddf7c726d813baf4'
    }).when('/tb_dz', {
      templateUrl: 'partials/toubao_dingzhi_all.html',
      controller: 'ybwxToubaoDingzhiAllCtrl',
      title: "确认投保",
      css:'css/toubao.css?rev=068e5e2c1f4916439fa5506df6a1e44d'
    }) .when('/verify_information', {
      templateUrl: 'partials/verify_information.html',
      controller: 'ybwxverify_informationCtrl',
      title: "验真说明"
    }).when('/pay_select', {
      templateUrl: 'partials/pay_select_new.html?v=123',
      controller: 'ybwxPaySelectNewCtrl',
      title: "支付"
    }).when('/list', {
      templateUrl: 'partials/list.html',
      controller: 'wxListCtrl',
      title: "特卖商城"
    }).when('/claim_information', {
      templateUrl: 'partials/claim_information.html',
      controller: 'ybwxclaim_informationCtrl',
      title: "理赔说明"
    }).when('/tb_notive', {
      templateUrl: 'partials/tb_notive.html',
      controller: 'ybwxtb_notivelCtrl',
      title: "投保须知"
    }).when('/detail', {
      templateUrl: 'partials/detail.html',
      controller: 'wxDetailCtrl',
      title: "特卖商城"
    }).when('/temaidetail', {
      templateUrl: 'partials/temai_detail.html',
      controller: 'wxDetailNewCtrl',
      title: "特卖商城"
    }).when('/temaiindex', {
      templateUrl: 'partials/temai_index.html',
      controller: 'wxTemaiIndexCtrl',
      title: "特卖商城"
    }).when('/temailist', {
      templateUrl: 'partials/temai_list.html',
      controller: 'wxTemaiListCtrl',
      title: "特卖商城"
    }).when('/bd_list', {
      templateUrl: 'partials/bd_list.html',
      controller: 'wxBaoDanListCtrl',
      title: "我的订单"
    }).when('/bd_detail', {
      templateUrl: 'partials/bd_detail.html',
      controller: 'wxBaoDanDetailCtrl',
      title: "订单详情"
    }).when('/success', {
      templateUrl: 'partials/success.html',
      controller: 'ybwxSuccessCtrl',
      title: "投保成功"
    }).when('/jingzhun', {
      templateUrl: 'partials/jingzhun.html',
      controller: 'ybwxJingzhunCtrl',
      title: "特卖商城"
    }).when('/information', {
      templateUrl: 'partials/information.html',
      controller: 'ybwxInfoCtrl',
      title: "投保须知"
    }).when('/education', {
      templateUrl: 'partials/education.html',
      controller: 'ybwxEducationCtrl',
      title: "如何投保",
      css:"css/education.css"
    }).when('/edindex', {
      templateUrl: 'partials/ed_index.html',
      controller: 'ybwxEdIndexCtrl',
      title: "保障详情"
    }).when('/continue', {
      templateUrl: 'partials/continue.html',
      controller: 'ybwxContinueCtrl',
      title: "敬请期待"
    }).when('/userinfo', {
      templateUrl: 'partials/userinfo.html',
      controller: 'ybwxUserinfoCtrl',
      title: "资料设定"
    }).when('/bd_index', {
      templateUrl: 'partials/bd_index.html',
      controller: 'ybwxBDIndexCtrl',
      title: "保单上传"
    }).when('/bd_pic', {
      templateUrl: 'partials/bd_pic.html',
      controller: 'ybwxBDPicCtrl',
      title: "保单上传"
    }).when('/offical', {
      templateUrl: 'partials/offical_site.html',
      controller: 'ybwxOfficalSiteCtrl',
      title: "官网信息"
    }).when('/bdm_list', {
      templateUrl: 'partials/bdm_list.html',
      controller: 'ybwxbaodanManageListCtrl',
      title: "我的保单"
    }).when('/bdm_detail', {
      templateUrl: 'partials/bdm_detail.html',
      controller: 'ybwxbaodanMDetailSiteCtrl',
      title: "保单详情"
    }).when('/bd_verify_list', {
      templateUrl: 'partials/bdm_verfylist.html',
      controller: 'ybwxbaodanVerifyListCtrl',
      title: "保单验真"
    }).otherwise({
      redirectTo: '/index'
    });
  }
]);



ybwxApp.run(['$rootScope',
  function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      //if (current.$$route) {
      /*
        if (current.hasOwnProperty('$$route')) {
           $rootScope.title = current.$$route.title;

        }*/
      if (current && current.title) {
        // document.title = current.title;
        var $body = $('body');
        document.title = current.title;
        // hack在微信等webview中无法修改document.title的情况
        var $iframe = $('<iframe src="/favicon.ico" style="display:none"></iframe>');
        $iframe.on('load', function() {
          setTimeout(function() {
            $iframe.off('load').remove();
          }, 0);
        }).appendTo($body);
      }
      // }
    });
  }
]);

/*
ybwxApp.service('payInfo', function() {
    var data = {};

    var setPayInfo = function (orderId,channelType,info) {
        if(!data[orderId]){
           data[orderId] = {};
        }
        data[orderId][channelType] = info;
    }
    var getPayInfo = function(orderId,channelType){
        if(data[orderId]){
            return data[orderId][channelType];
        }else{
          return {};
        }
    }
    return {
        setPayInfo:setPayInfo,
        getPayInfo:getPayInfo
    }
});*/
/*
    .when('/tb', {
      templateUrl: 'partials/toubao.html?v=123',
      controller: 'ybwxToubaoCtrl'
    })*/