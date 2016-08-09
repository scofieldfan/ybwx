'use strict';

/* App Module */

var wxShareApp = angular.module('wxShareApp', [
  'ngRoute',
  'ybwx-directives',
  'wxShareControllers',
  'routeStyles'
]);
wxShareApp.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
  when('/paybd', {
    templateUrl: 'wx_share/partials/paybd_part.html',
    controller: 'wxSharePayBdCtrl',
    css:'wx_share/css/index.css?rev=1d48153f5cc4f9f46ffa6bef3dc56ef0'
  }).when('/success', {
    templateUrl: 'wx_share/partials/success_part.html',
    controller: 'wxShareSuccessCtrl',
    css:'wx_share/css/success.css?rev=6e97a399828e58f5cc4f9f46ffa6bef3dc56ef0'
  }).when('/index', {
    templateUrl: 'wx_share/partials/index_part.html',
    controller: 'wxShareIndexCtrl',
    css:'wx_share/css/index.css?rev=1d48153f5cc4f9f46ffa6bef3dc56ef0'
  }).when('/success_coupon', {
    templateUrl: 'wx_share/partials/success_coupon.html',
    controller: 'wxSharesuccessCouponCtrl',
    css:'wx_share/css/success_coupon.css?rev=d35495d458afaf9f46ffa6bef3dc56ef0'
  }).when('/freebd', {
    templateUrl: 'wx_share/partials/bd_part.html',
    controller: 'wxShareBdCtrl',
    css:'wx_share/css/bd_part.css?rev=asdfsd'
  }).when('/moneybd', {
    templateUrl: 'wx_share/partials/fee_part.html',
    controller: 'wxMoneyBdCtrl',
    css:'wx_share/css/bd_part.css?rev=8e68c986fb12f10c9f46ffa6bef3dc56ef0'
  }).when('/couponlist', {
    templateUrl: 'wx_share/partials/coupon_list.html',
    controller: 'myCouponListCtrl',
    css:'wx_share/css/coupon.css?rev=09435'
  }).when('/exchange', {
    templateUrl: 'wx_share/partials/exchange.html',
    css:'wx_share/css/exchange.css?rev=85a23c8sdfsd'
  }).when('/jixian', {
    templateUrl: 'wx_share/partials/jixian.html',
    controller: 'sportsCtrl',
    css:'wx_share/css/index.css?rev=1d48153f5cc4f9f46ffa6bef3dc56ef0'
  }).when('/special', {
    templateUrl: 'wx_share/partials/special_offer.html',
    controller: 'specialCtrl',
    css:'wx_share/css/special_offer.css?rev=7ddcb90f9f46ffa6bef3dc56ef0'
  }).when('/shenhe', {
    templateUrl: 'wx_share/partials/special_offer.html',
    controller: 'specialCtrl',
    css:'wx_share/css/special_offer.css?rev=7ddcb904c4df46ffa6bef3dc56ef0'
  }).otherwise({
    redirectTo: '/index'
  });
}]);