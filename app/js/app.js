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
  'autoPromoteControllers',
  'routeStyles'
]).value('cgBusyDefaults', {
  message: '正在加载....',
  templateUrl: 'template/loading.html'
});

ybwxApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i = 0; i < total; i++) {
      input.push(i);
    }

    return input;
  };
});
ybwxApp.filter('setDecimal', function($filter) {
  return function(input, places) {
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
      templateUrl: 'partials/newindex_part.html?v=123',
      controller: 'ybwxNewIndexCtrl',
      title: '诺贝保险管家',
      css:'http://static.nuobei.cn/css/newindex_part.css?rev=db9ade35cbbcf5aebbbdb2ee62c40e77'
    }).when('/bd_education_new', {
      templateUrl: 'partials/bd_education_new.html',
      controller: 'ybwxBdEducationNewCtrl',
      title: "保障评分",
      css:'http://static.nuobei.cn/css/bd_education_new.css?rev=c090302fe12effaffef898248bb51b54'
    }).when('/bd_education_family', {
      templateUrl: 'partials/bd_education_family.html',
      controller: 'ybwxBdEducationNewCtrl',
      title: "保障评分"
    }).when('/select', {
      templateUrl: 'partials/select_part.html?v=123',
      controller: 'ybwxSelectCtrl',
      title: "保障提升",
      css:'http://static.nuobei.cn/css/ring.css?rev=c63a06ceedb5b686280a30dbca14c419'
    }).when('/solution', {
      templateUrl: 'partials/solution.html',
      controller: 'ybwxSolutionCtrl',
      title: "保障方案",
      css:'http://static.nuobei.cn/css/solution.css?rev=51c8bd3f32be358917967d55dc053768'
    }).when('/sx_bzts', {
      templateUrl: 'partials/sx_bzts.html?v=12dsdsfdf543',
      controller: 'ybwxAgeInsuranceCtrl',
      title: "寿险保障提升",
      css:'http://static.nuobei.cn/css/ring.css?rev=c63a06ceedb5b686280a30dbca14c419'
    }).when('/jk_bzts', {
      templateUrl: 'partials/jk_bzts.html?v=12dsdsfdf543',
      controller: 'ybwxMoneyDurationCtrl',
      title: "定制修改"
    }).when('/toubao_new', {
      templateUrl: 'partials/toubao_new.html',
      controller: 'ybwxToubaoNewCtrl',
      title: "投保确认",
      css:'http://static.nuobei.cn/css/toubao_new.css?rev=9c38cbf065d413909ddd050d17f7bdf1'
    }).when('/promote', {
      templateUrl: 'partials/bz_ts.html',
      controller: 'ybwxPromoteCtrl',
      title: "保障提升"
    }).when('/target', {
      templateUrl: 'partials/target.html',
      controller: 'ybwxTargetCtrl',
      title: "保障对象",
      css:'http://static.nuobei.cn/css/ensuring_target.css?rev=fa3114468d3b3a8c3179231731b05e6d'
    }).when('/hobby', {
      templateUrl: 'partials/hobby.html',
      controller: 'ybwxHobbyCtrl',
      title: "偏好设定",
      // css: 'http://static.nuobei.cn/css/preference.css?rev=dgfdgdfgdfgdfg65fdgfd'
    }).when('/userinfo_new', {
      templateUrl: 'partials/userinfo_new.html',
      controller: 'ybwxUserInfoNewCtrl',
      title: "资料设定",
      css:'http://static.nuobei.cn/css/userinfo_new.css?rev=432ce1d5947e69931411b158c31e432c'
    }).when('/scheme', {
      templateUrl: 'partials/scheme.html',
      controller: 'ybwxSchemeCtrl',
      title: "方案解读"
      // css: 'http://static.nuobei.cn/css/scheme.css'
    }).when('/key_solution', {
      templateUrl: 'partials/key_solution.html',
      controller: 'ybwxKeySolutionCtrl',
      title: "保障方案",
      css:'http://static.nuobei.cn/css/solution.css?rev=51c8bd3f32be358917967d55dc053768'
    }).when('/service', {
      templateUrl: 'partials/service.html',
      controller: 'ybwxServiceCtrl',
      title: "服务",
      css:'http://static.nuobei.cn/css/service.css?rev=ccb7b72ecdc803068fa76ac098ed10f2'
    }).when('/about_nuobei', {
      templateUrl: 'partials/about_nuobei.html',
      title: "关于诺贝",
      css:'http://static.nuobei.cn/css/about_nuobei.css?rev=ae4ad37c360dd52474bee1c696a3c0da'
    }).when('/contact', {
      templateUrl: 'partials/contact.html',
      title: "联系我们",
      css: 'http://static.nuobei.cn/css/contact.css?rev=8e0e23f4630665fec18595ec646adb41'
    }).when('/collection', {
      templateUrl: 'partials/collection.html',
      title: "我的收藏"
    }).when('/bz', {
      templateUrl: 'partials/bz_list.html?v=123',
      controller: 'ybwxBzCtrl',
      title: "定制保障说明",
      css:'http://static.nuobei.cn/css/bz.css?rev=bce3af9d845381e3dc7cfd8fd513b4c9'
    }).when('/tb_dz', {
      templateUrl: 'partials/toubao_dingzhi_all.html',
      controller: 'ybwxToubaoDingzhiAllCtrl',
      title: "确认投保",
      css:'http://static.nuobei.cn/css/toubao.css?rev=jsdhfjhsd'
    }).when('/verify_information', {
      templateUrl: 'partials/verify_information.html',
      controller: 'ybwxverify_informationCtrl',
      title: "验真说明"
    }).when('/pay_select', {
      templateUrl: 'partials/pay_select_new.html?v=123',
      controller: 'ybwxIPayNowCtrl',
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
      title: "诺贝严选",
      css:'http://static.nuobei.cn/css/temai_detail.css?rev=a707a05ad4b889277f94e33590642d5a'
    }).when('/temaiindex', {
      templateUrl: 'partials/temai_index.html',
      controller: 'wxTemaiIndexCtrl',
      title: "诺贝严选",
      css:'http://static.nuobei.cn/css/temai_index.css?rev=11b1591a379185d1ba3b2d1f9405a2d7'
    }).when('/temailist', {
      templateUrl: 'partials/temai_list.html',
      controller: 'wxTemaiListCtrl',
      title: "诺贝严选",
      css:'http://static.nuobei.cn/css/temai_list.css?rev=0e539480736a12281b466e8fa72795cb'
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
      title: "支付成功"
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
      css:"http://static.nuobei.cn/css/education.css?rev=893734c647381c2bdc4b6b133c497b7b"
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
    }).when('/bdm_list', {
      templateUrl: 'partials/bdm_list.html',
      controller: 'ybwxbaodanManageListCtrl',
      title: "我的保单"
    }).when('/bdm_detail', {
      templateUrl: 'partials/bdm_detail.html',
      controller: 'ybwxbaodanMDetailSiteCtrl',
      title: "保单详情"
    }).when('/insurance_policy', {
      templateUrl: 'partials/insurance_policy.html',
      controller: 'ybwxbaodaninsurancePolicyCtrl',
      title: "发送保单"
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
      controller: 'ybwxSupplyInfoCtrl',
      title: "被保人信息"
    }).when('/terms', {
      templateUrl: 'partials/product_terms.html',
      title: "产品条款"
    }).when('/terms_list', {
      templateUrl: 'partials/terms_list.html',
      controller: 'ybwxtermsListCtrl',
      title: "产品条款列表"
    }).when('/yixiangsu', {
      templateUrl: 'partials/yixiangsu.html',
      title: "一像素"
    }).when('/test', {
      templateUrl: 'partials/test.html',
      title: "一像素"
    }).when('/score_reading', {
      templateUrl: 'partials/score_reading.html',
      title: "评分解读",
      controller: 'ybwxscoreReadingCtrl'
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

