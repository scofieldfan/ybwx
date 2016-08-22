'use strict';

/* Controllers */

var ybwxControllers = angular.module('ybwxControllers', []);


ybwxControllers.controller('wxTemaiIndexCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
    function ($scope, $routeParams, $location, $http, $rootScope) {

        util.share({
            shareUrl: util.domain + "#/temaiindex",
            shareImg: "/img/icon.jpg",
            shareTitle: "诺贝保险管家-特卖商城",
            shareDesc: "严选优质产品，全网低价出售，还有更多福利免费领取！"
        }); //定义本页分享形式
        $scope.loadReady = false;
        var code = util.getParameterByName("code") || $routeParams.code;

        $scope.listPromise = getHttpPromise($http, $rootScope, 'POST', api['temai_index'], {}, function (res) {
            if (res && res.data && res.data.data) {
                $scope.categorys = res.data.data.categorys;
            }
            $scope.loadReady = true;
        });

        var cellClass = ".cell-footer";
        $scope.goIndex = function ($event) {
            //$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
            //$($event.target).parents(cellClass).addClass("hover");
            $location.path('/index').search();
        }
        $scope.goTemai = function ($event) {
            //$($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
            //$($event.target).parents(cellClass).addClass("hover");
            $location.path('/temaiindex').search();
        }
        $scope.goService = function ($event) {
            // $($event.target).parents(".fix_container ").find(cellClass).removeClass("hover");
            // $($event.target).parents(cellClass).addClass("hover");
            $location.path('/service').search();
        }
        $("#foucs_button").click(function (event) {
            $(".qrcode-wrapper").show();
            event.preventDefault();
            event.stopPropagation();
        })
        $(".qrcode-container").click(function (event) {
            event.preventDefault();
            event.stopPropagation();
        })
        $(".qrcode-wrapper").click(function (event) {
            $(".qrcode-wrapper").hide();
        })
        $scope.goCategory = function (categoryId) {
            $location.path("/temailist").search({
                "category_id": categoryId
            });
        }
        $scope.goDetail = function (id) {

            $location.path("/temaidetail").search({
                "product_id": id
            });

        }
        $("body").on("click", "#showShare", function () {
            $("#share_ctrl").show();
        })
        $("body").on("click", "#share_ctrl", function () {
            $("#share_ctrl").hide();
        }).on("click", "#opacity_ctrl", function () {
            $("#share_ctrl").hide();
        })
    }
]);

/*特卖list*/
ybwxControllers.controller('wxTemaiListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
    function ($scope, $routeParams, $location, $http, $rootScope) {


        $scope.isHaveResult = true;

        util.share({
            shareUrl: util.domain + "#/temailist"
        });

        $scope.getNav = function () {
            $scope.isHaveResult = true;
            $scope.listPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurance_category'], {}, function (res) {
                if (res && res.data && res.data.data) {
                    $scope.navItems = res.data.data.categories;
                } else {
                    $scope.isHaveResult = false;
                }
            })
        }
        $scope.getCateList = function (category_id) {
            $scope.category_id = category_id;
            $scope.catePromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurance_category_insurance'], {
                "category_id": category_id
            }, function (res) {
                if (res && res.data && res.data.data) {
                    $scope.cateItems = res.data.data.insurances;
                }
            })
        }
        $scope.init = function () {
            var code = util.getParameterByName("code") || $routeParams.code;
            var defaultCategory = $routeParams.category_id || 3;
            $scope.getNav();
            $scope.getCateList(defaultCategory);
        }

        $scope.goCateDetail = function (id) {
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

ybwxControllers.controller('wxDetailNewCtrl', ['$scope', '$q', '$filter', '$routeParams', '$location', '$http', '$rootScope',
    function ($scope, $q, $filter, $routeParams, $location, $http, $rootScope) {

        _hmt.push(['_trackPageview', $location.path()]);


        //大特医保需要跳转到说明页
        // if ($routeParams.product_id === "86" && $routeParams.source === "ad") {
        //   location.href = "http://r.xiumi.us/stage/v5/2lDxG/18511765";
        //   return;
        // }
        $scope.genDanwei = function (type) {
            return coveragePeriodMap[type];
        }
        $scope.gender = 1;

        function updateFee() {

            $scope.catePromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurances_sex'], {
                "insurance_plan_id": $scope.plan.id,
                "birthday": $scope.birthday,
                "gender": $scope.gender,
                "coverage_period_type": $scope.coverage_period_type,
                "charge_period_type": $scope.charge_period_type,
                "coverage_period": $scope.coverage_period,
                "charge_period": $scope.charge_period,
            }, function (res) {
                if (res && res.data && res.data.data) {
                    $scope.money = res.data.data.premium;
                }
            })
        };

        $scope.getRestrictions = function () {
            $scope.restrictionPromise = getHttpPromise($http, $rootScope, 'POST', api['get_restrictions'], {
                plan_ids: [$scope.plan.id]

            }, function (res) {

                $scope.isHaveRestrictions = (res.data.data.job_notice && Object.keys(res.data.data.job_notice).length > 0) || res.data.data.locale_notice || res.data.data.notices.length > 0;
                // console.log("extranotice:" + $scope.isExtraNotice.length);

            });
        };

        function computeDate(age) {
            var date = new Date();
            if (typeof age === "string") {
                if (age.indexOf("d") > 0) {
                    //天
                    age = age.replace("d", "");
                    date = util.minusDays(date, parseInt(age));
                } else {
                    //年
                    date.setFullYear(date.getFullYear() - parseInt(age));

                }
            }
            return date;
        };

        $scope.init = function () {
            // $scope.birthday = "19860101";
            //$scope.showBirthday = "1986-01-01";


            var code = util.getParameterByName("code") || $routeParams.code;

            $scope.haveMask = false;
            $scope.selectTable = 0;
            $scope.maskPromise = getHttpPromise($http, $rootScope, 'GET', api['get_insurances_mask'].replace("{productId}", $routeParams.product_id), {}, function (res) {
                if (res.data && res.data.data && res.data.data.plans) {
                    $scope.maskData = res.data.data;
                    $scope.maskPlans = res.data.data.plans;
                    $scope.maskSelectPlan = $scope.maskPlans[Object.keys($scope.maskPlans)[0]];
                    $scope.coverage_period = $scope.maskSelectPlan.coverage_periods[0];
                    $scope.coverage_period_type = $scope.maskSelectPlan.coverage_period_type;

                    if ($scope.maskSelectPlan.charge_periods) {
                        $scope.charge_period = $scope.maskSelectPlan.charge_periods[0];
                    }
                    $scope.charge_period_type = $scope.maskSelectPlan.charge_period_type;
                    if ($scope.maskData.min_age) {
                        $scope.minDate = computeDate($scope.maskData.max_age); //最大年龄，对应的是最小日期
                    }
                    if ($scope.maskData.max_age) {
                        $scope.maxDate = computeDate($scope.maskData.min_age); //最小年龄，对应的是最大日期
                    }
                    if ($scope.maskData.valid_genders && $scope.maskData.valid_genders.length > 0) {
                        $scope.gender = $scope.maskData.valid_genders[0]
                    }
                    $scope.birthday = $filter('date')($scope.maxDate, "yyyyMMdd");
                    $scope.showBirthday = $filter('date')($scope.maxDate, "yyyy-MM-dd");

                    var calendar = new LCalendar();
                    calendar.init({
                        'trigger': '#birthdayInputDom', //标签id
                        'type': 'date',
                        'minDate': $filter('date')($scope.minDate, "yyyy-MM-dd"), //最小日期
                        'maxDate': $filter('date')($scope.maxDate, "yyyy-MM-dd"), //最大日期
                        confirmCallback: function (value) {
                            $scope.birthday = value;
                            updateFee();
                        }
                    });


                    if (Object.keys(res.data.data.plans).length > 1 || res.data.data.premium_type == 2) {
                        $scope.haveMask = true;
                    }
                }
            })
        };


        $scope.myPromise = getHttpPromise($http, $rootScope, 'POST', api['get_insurances_detail'], {
            "insurance_id": $routeParams.product_id
        }, function (res) {

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

                    plan.main_coverage_beans = plan.coverage_beans.filter(function (item) {
                        return item.coverage_type == 1;
                    });
                    plan.second_coverage_beans = plan.coverage_beans.filter(function (item) {
                        return item.coverage_type == 2;
                    });

                }
                if (res.data.data.coverage_overview) {
                    $scope.coverage_overviews = res.data.data.coverage_overview.split("##");
                }

                /*
                 sharedRestrictions.setRestrictions({
                 health_notice: res.data.data.health_notice,
                 extra_notice: res.data.data.extra_notice,
                 locale_notice: res.data.data.locale_notice
                 })*/
                $scope.data = res.data.data;
                $scope.detailMoney = $scope.money = res.data.data.insurance_plans[0].premium;
                $scope.plan = res.data.data.insurance_plans[0];
                $scope.danwei = genDuration($scope.plan.coverage_period_type);
                $scope.getRestrictions();
                util.share({
                    shareUrl: util.domain + "#/temaidetail?product_id=" + $routeParams.product_id,
                    shareImg: $scope.data.small_image,
                    shareTitle: $scope.data.insurance_name,
                    shareDesc: $scope.data.insurance_description
                });
            }

        });

        $q.all([$scope.maskPromise, $scope.myPromise]).then(function (res) {
            if ($scope.maskData.premium_type == 2) { //浮动价格才需要更新保费
                updateFee();
            }
        });

        /**/


        $scope.more = function ($event) {
            var element = $event.currentTarget;
            var switchValue = $(element).attr("data-switch");
            if (switchValue === 'on') {
                $(element).siblings().removeClass("ng-hide");
                $(element).find("span").html("收起");
                $(element).attr("data-switch", "off");
                $(element).find(".icon-arrow").addClass("up");
                _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_unfold']);
            } else {
                $(element).siblings(":gt(6)").addClass("ng-hide");
                $(element).find("span").html("查看更多");
                $(element).attr("data-switch", "on");
                $(element).find(".icon-arrow").removeClass("up");
                _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_fold']);
            }
        };

        $scope.stopPro = function ($event) {
            $event.stopPropagation();
        };


        $scope.clickBirthDay = function ($event) {
            $event.stopPropagation();
            // updateFee();
        };

        $scope.changeBirthday = function ($event) {
            // $event.stopPropagation();
            //  $event.preventDefault();
            _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_changebirthday']);
            updateFee();
        };


        $scope.changeSex = function ($event, gender) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.gender = gender;
            updateFee();
            _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_changesex']);
        };

// console.log($scope.dataNum );
        $scope.changeMaskTaoCan = function ($event, item) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.plan = item;
            $scope.maskSelectPlan = $scope.maskPlans[item.id];
            $scope.danwei = genDuration($scope.plan.coverage_period_type);
            //$scope.money = $scope.plan.premium;
            $scope.getRestrictions();
            if ($scope.maskData.premium_type == 2) { //浮动价格更新保费
                updateFee();
            } else {
                $scope.money = $scope.plan.premium;
            }
            _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_changetaocan']);
        };

        $scope.changeDuration = function ($event, item) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.coverage_period = item;
            updateFee();
            _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_changeduration']);
        };

        $scope.changeFee = function ($event, item) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.charge_period = item;
            updateFee();
            _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_changefee']);
        };

        $scope.headSelect = function ($event, plan) {
            var element = $event.currentTarget;
            $(".btn-container").find("a").removeClass("weui_btn_primary")
            $(element).addClass("weui_btn_primary");
            var index = $(element).attr("data-index");
            $scope.selectTable = index;
            // $("#title-table").attr("data-current-select-id", plan.id);
            //console.log($(element));
            $scope.plan = plan;
            $scope.danwei = genDuration($scope.plan.coverage_period_type);
            $scope.detailMoney = plan.premium;
            //updateFee();
            _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_changeheadtaocan']);

        };

        /*
         Coverage_Period_Type:
         (0, "保障期间类型未知"),
         (1, "保终身"),
         (2, "按年保"),
         (3, "按年龄限保"),
         (4, "按月保"),
         (5, "按天保");*/

        $scope.showMask = function () {
            if ($scope.haveMask) {
                $("#detail_mask_container").show();
                // var   maskScroll = new IScroll('#birthdayScrollContainer',{click:true, tap: true });
            } else {
                $scope.submit();
            }
            _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_showMask']);
        };

        $scope.submit = function () {
            //获得当前的plan
            // util.enableScroll();
            var selectPlan = $scope.plan.id;
            _hmt.push(['_trackEvent', 'temai_detail', 'temai_detail_submit']);

            var postData = {
                "plan_id": selectPlan,
                // "choose_plans": JSON.stringify([selectPlan]),
                'new_choose_plans': JSON.stringify([{
                    id: selectPlan,
                    coverage_period: $scope.coverage_period,
                    charge_period: $scope.charge_period
                }])
            };

            if ($scope.coverage_period_type) {
                postData["coverage_period_type"] = $scope.coverage_period_type;
            }
            ;
            if ($scope.charge_period_type) {
                postData["charge_period_type"] = $scope.charge_period_type;
            }
            ;

            if ($scope.coverage_period) {
                postData["coverage_period"] = $scope.coverage_period;
            }
            ;
            if ($scope.charge_period) {
                postData["charge_period"] = $scope.charge_period;
            }


            if ($scope.isHaveRestrictions) {
                $location.path("/information").search(postData);
            } else {
                $location.path("/toubao_new").search(postData);
            }
        };
    }]
);

ybwxControllers.controller('ybwxSuccessCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
    function ($scope, $filter, $routeParams, $location, $http, $rootScope) {

        _hmt.push(['_trackPageview', $location.path()]);
        //sessionStorage
        //$scope.orderId = $location.search().order_no;
        $scope.send_bd = function () {
            if (!sendForm.email.$invalid) {
                util.sendMail($http, $rootScope, api['send_bd'], $scope.user.email, $location.search().order_no);

            }
        }
        $scope.goList = function () {
            window.location.href = "wx_list.html";
        }
        $scope.showShareTip = function () {
            shareTip();
        }
    }
]);