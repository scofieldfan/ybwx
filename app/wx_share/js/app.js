'use strict';

/* App Module */

var wxShareApp = angular.module('wxShareApp', [
  'ngRoute',
  'ngCookies',
  'ybwx-directives',
  'wxShareControllers'
]);
wxShareApp.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
  when('/paybd', {
    templateUrl: 'wx_share/partials/paybd_part.html',
    controller: 'wxSharePayBdCtrl'
  }).when('/success', {
    templateUrl: 'wx_share/partials/success_part.html',
    controller: 'wxShareSuccessCtrl'
  }).when('/index', {
    templateUrl: 'wx_share/partials/index_part.html',
    controller: 'wxShareIndexCtrl'
  }).when('/success_coupon', {
    templateUrl: 'wx_share/partials/success_coupon.html',
    controller: 'wxSharesuccessCouponCtrl'
  }).when('/freebd', {
    templateUrl: 'wx_share/partials/bd_part.html',
    controller: 'wxShareBdCtrl'
  }).when('/moneybd', {
    templateUrl: 'wx_share/partials/fee_part.html',
    controller: 'wxMoneyBdCtrl'
  }).when('/couponlist', {
    templateUrl: 'wx_share/partials/coupon_list.html',
    controller: 'myCouponListCtrl'
  }).when('/exchange', {
    templateUrl: 'wx_share/partials/exchange.html',
    controller: 'myExchangetCtrl'
  }).when('/jixian', {
    templateUrl: 'wx_share/partials/jixian.html',
    controller: 'sportsCtrl'
  }).when('/special', {
    templateUrl: 'wx_share/partials/special_offer.html',
    controller: 'specialCtrl'
  }).when('/shenhe', {
    templateUrl: 'wx_share/partials/special_offer.html',
    controller: 'specialCtrl'
  }).otherwise({
    redirectTo: '/index'
  });
}]);