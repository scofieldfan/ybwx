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
]).value('cgBusyDefaults',{
  message:'正在加载....',
  templateUrl: 'template/loading.html'
});

ybwxApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/index', {
      templateUrl: 'partials/index_part.html?v=123',
      controller: 'ybwxIndexCtrl'
    }).when('/select', {
      templateUrl: 'partials/select_part.html?v=123',
      controller: 'ybwxSelectCtrl'
    }).when('/bz', {
      templateUrl: 'partials/bz_list.html?v=123',
      controller: 'ybwxBzCtrl'
    })
    /*
    .when('/pay_select', {
      templateUrl: 'partials/pay_select.html?v=123',
      controller: 'ybwxPaySelectCtrl'
    })*/
    .when('/flexbox', {
      templateUrl: 'partials/flexbox.html',
      controller: 'ybwxflexCtrl'
    }).when('/pay_select', {
      templateUrl: 'partials/pay_select_new.html?v=123',
      controller: 'ybwxPaySelectNewCtrl'
    }).when('/list', {
      templateUrl: 'partials/list.html',
      controller: 'wxListCtrl'
    }).when('/claim_information', {
      templateUrl: 'partials/claim_information.html',
      controller: 'ybwxclaim_informationCtrl'
    }).when('/tb_notive', {
      templateUrl: 'partials/tb_notive.html',
      controller: 'ybwxtb_notivelCtrl'
    }).when('/my_bd', {
      templateUrl: 'partials/my_bd.html',
      controller: 'ybwxmy_bdlCtrl'
    }).when('/detail', {
      templateUrl: 'partials/detail.html',
      controller: 'wxDetailCtrl'
    }).when('/bd_list', {
      templateUrl: 'partials/bd_list.html',
      controller: 'wxBaoDanListCtrl'
    }).when('/bd_detail', {
      templateUrl: 'partials/bd_detail.html',
      controller: 'wxBaoDanDetailCtrl'
    }).when('/success', {
      templateUrl: 'partials/success.html',
      controller: 'ybwxSuccessCtrl'
    }).when('/jingzhun', {
      templateUrl: 'partials/jingzhun.html',
      controller: 'ybwxJingzhunCtrl'
    }).when('/information', {
      templateUrl: 'partials/information.html',
      controller: 'ybwxInfoCtrl'
    }).when('/education', {
      templateUrl: 'partials/education.html',
      controller: 'ybwxEducationCtrl'
    }).when('/tb_dz', {
      templateUrl: 'partials/toubao_dingzhi_all.html',
      controller: 'ybwxToubaoDingzhiAllCtrl'
    }).when('/edindex', {
      templateUrl: 'partials/ed_index.html',
      controller: 'ybwxEdIndexCtrl'
    }).when('/continue', {
      templateUrl: 'partials/continue.html',
      controller: 'ybwxContinueCtrl'
    }).when('/userinfo', {
      templateUrl: 'partials/userinfo.html',
      controller: 'ybwxUserinfoCtrl'
    }).when('/bd_index', {
      templateUrl: 'partials/bd_index.html',
      controller: 'ybwxBDIndexCtrl'
    }).when('/bd_pic', {
      templateUrl: 'partials/bd_pic.html',
      controller: 'ybwxBDPicCtrl'
    })
    /*
    .when('/test', {
      templateUrl: 'partials/test.html',
      controller: 'ybwxTestCtrl'
    })*/
    .when('/bd_education', {
      templateUrl: 'partials/bd_education.html',
      controller: 'ybwxBdEducationCtrl'
    }).when('/offical', {
      templateUrl: 'partials/offical_site.html',
      controller: 'ybwxOfficalSiteCtrl'
    }).when('/bdm_list', {
      templateUrl: 'partials/bdm_list.html',
      controller: 'ybwxbaodanManageListCtrl'
    }).when('/bdm_detail', {
      templateUrl: 'partials/bdm_detail.html',
      controller: 'ybwxbaodanMDetailSiteCtrl'
    }).otherwise({
      redirectTo: '/index'
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
