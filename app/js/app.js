'use strict';

/* App Module */

var ybwxApp = angular.module('ybwxApp', [
  'ngRoute',
  'cgBusy',
  'ybwx-directives',
  'ybwxControllers',
  'mainControllers',
  'baodanControllers',
  'serviceControllers',
  'transactionControllers',
  'routeStyles'
]).value('cgBusyDefaults', {
  message: '正在加载....',
  templateUrl: 'template/loading.html'
});
ybwxApp.service('sharedRestrictions', function () {
        var restrictions = {};

        return {
            getRestrictions: function () {
                return restrictions;
            },
            setRestrictions: function(value) {
                restrictions = value;
            }
        };
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
      title: '诺贝保险管家',
      css:'css/index_part.css?rev=70e9ef4a2d64a2c158e07e16703a5b4f'
    }).when('/bd_education', {
      templateUrl: 'partials/bd_education_new.html',
      controller: 'ybwxBdEducationNewCtrl',
      title: "保障评分",
      css:'css/bd_education_new.css?rev=f75f255464c7054d1927e7b0aad01deb'
    }).when('/select', {
      templateUrl: 'partials/select_part.html?v=123',
      controller: 'ybwxSelectCtrl',
      title: "保障提升",
      css:'css/ring.css?rev=9878786b68782e9262c658dc18ebb644'
    }).when('/solution', {
      templateUrl: 'partials/solution.html',
      controller: 'ybwxSolutionCtrl',
      title: "保障方案",
      css:'css/solution.css?rev=4e5ab81ac83b3dcc5b34a3245007b24c'
    }).when('/toubao_new', {
      templateUrl: 'partials/toubao_new.html',
      controller: 'ybwxToubaoNewCtrl',
      title: "投保确认",
      css:'css/toubao_new.css?rev=243bb8de239f91c386c1acf620954055'
    }).when('/promote', {
      templateUrl: 'partials/bz_ts.html',
      controller: 'ybwxPromoteCtrl',
      title: "保障提升"
    }).when('/service', {
      templateUrl: 'partials/service.html',
      controller: 'ybwxServiceCtrl',
      title: "服务",
      css:'css/service.css?rev=473126171dfc19c112d9a2112fc7fe64'
    }).when('/contact', {
      templateUrl: 'partials/contact.html',
      title: "联系我们"
    }).when('/bz', {
      templateUrl: 'partials/bz_list.html?v=123',
      controller: 'ybwxBzCtrl',
      title: "定制保障说明",
      css:'css/bz.css?rev=bce3af9d845381e3dc7cfd8fd513b4c9'
    }).when('/tb_dz', {
      templateUrl: 'partials/toubao_dingzhi_all.html',
      controller: 'ybwxToubaoDingzhiAllCtrl',
      title: "确认投保",
      css:'css/toubao.css?rev=f3ffc1c7c6127270ee93c5a79a4b591c'
    }) .when('/verify_information', {
      templateUrl: 'partials/verify_information.html',
      controller: 'ybwxverify_informationCtrl',
      title: "验真说明"
    }).when('/pay_select', {
      templateUrl: 'partials/pay_select_new.html?v=123',
      controller: 'ybwxPaySelectNewCtrl',
      title: "支付"
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
      title: "诺贝严选"
    }).when('/temaiindex', {
      templateUrl: 'partials/temai_index.html',
      controller: 'wxTemaiIndexCtrl',
      title: "诺贝严选",
      css:'css/temai_index.css?rev=11b1591a379185d1ba3b2d1f9405a2d7'
    }).when('/temailist', {
      templateUrl: 'partials/temai_list.html',
      controller: 'wxTemaiListCtrl',
      title: "诺贝严选"
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
    }).when('/pay_success', {
      templateUrl: 'partials/pay_success.html',
       title: "交易完成提示"
    }).when('/jingzhun', {
      templateUrl: 'partials/jingzhun.html',
      controller: 'ybwxJingzhunCtrl',
      title: "特卖商城"
    }).when('/information', {
      templateUrl: 'partials/information.html',
      controller: 'ybwxInfoCtrl',
      title: "投保须知"
    }).when('/productinformation', {
      templateUrl: 'partials/product_information.html',
      controller: 'ybwxProductInfoCtrl',
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
    }).when('/contact_list', {
      templateUrl: 'partials/contact_list.html',
      controller: 'ybwxContactListCtrl',
      title: "常用被保人"
    }).when('/update_add_contact', {
      templateUrl: 'partials/update_add_contact.html',
      controller: 'ybwxUpdateAddContactCtrl',
      title: "被保人信息"
    }).when('/supply_userinfo', {
      templateUrl: 'partials/supply_userinfo.html',
       controller: 'ybwxSupplayInfoCtrl',
      title: "被保人信息"
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