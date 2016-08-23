var SHARE = (function() {

  var init = function(shareUrl) {
    
   var api = {
     "signature": "/ybwx-web/wechat/js_signature"
   }

   function getOpenId() {
     return '--';
   }

   function getSign() {
     return $.ajax({
       type: 'GET',
       url: api["signature"],
       data: {
         "url": location.href.split('#')[0]
       },
       dataType: "json"
     })
   }
    function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function wxShareCallBack(a2) {

      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: a2[0].data["app_id"], // 必填，公众号的唯一标识
        timestamp: a2[0].data["timestamp"], // 必填，生成签名的时间戳
        nonceStr: a2[0].data["noncestr"], // 必填，生成签名的随机串
        signature: a2[0].data["signature"], // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function() {

        var shareTitle = "天寿助富您安享";
        var shareLink = shareUrl;
        var shareDesc = "即交快领高返还，满5年折合年化单利约4.5%";
        var shareImg = "http://wechat.nuobei.cn/anxiang/img/money.jpg";

        wx.onMenuShareTimeline({
          title: shareTitle,
          link: shareLink,
          imgUrl: shareImg,
          success: function() {
            // alert(shareLink);
            //console.log(shareLink);
          },
          cancel: function() {}
        });
        wx.onMenuShareAppMessage({
          title: shareTitle,
          desc: shareDesc,
          link: shareLink,
          imgUrl: shareImg,
          dataUrl: '',
          success: function() {
            // alert(shareLink);
           // window.location.href = shareLink;
          },
          cancel: function() {}
        });

        wx.onMenuShareQQ({
          title: shareTitle,
          desc: shareDesc,
          link: shareLink,
          imgUrl: shareImg,
          success: function() {},
          cancel: function() {}
        });

        wx.onMenuShareWeibo({
          title: shareTitle,
          desc: shareDesc,
          link: shareLink,
          imgUrl: shareImg,
          success: function() {},
          cancel: function() {}
        });

        wx.onMenuShareQZone({
          title: shareTitle,
          desc: shareDesc,
          link: shareLink,
          imgUrl: shareImg,
          success: function() {},
          cancel: function() {}
        });
      });
      wx.error(function(res) {
        // alert(res);
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

      });
    }
    $.when(getSign()).done(wxShareCallBack);
  }
  return {
    init: init
  }

})()