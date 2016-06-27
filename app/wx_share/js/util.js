var util={
	getParameterByName :  function (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	showToast:function($rootScope,msg){
	$rootScope.server_reason = msg;
	 $("#toast").show();
	 setTimeout(function(){
		 $("#toast").fadeOut();
	 }, 2000);
	},
	api : {
     "openid": "/ybwx-diplomat/wechat/open_id",
     "signature": "/ybwx-diplomat/wechat/js_signature"
   },
	share: function(shareObj) {
		
		return $.when($.ajax({
			type: 'GET',
			url: util.api["signature"],
			data: {
				"url": location.href.split('#')[0]
			},
			dataType: "json"
		})).done(function(res) {
			//依赖于微信的JS
			console.log(res);
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: res.data["app_id"], // 必填，公众号的唯一标识
				timestamp: res.data["timestamp"], // 必填，生成签名的时间戳
				nonceStr: res.data["noncestr"], // 必填，生成签名的随机串
				signature: res.data["signature"], // 必填，签名，见附录1
				jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'
				]
				// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function() {
				console.log("wexin success....")
				// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				var shareUrl = "http://web.youbaowuxian.com";
				var shareTitle = shareObj.shareTitle || "诺贝保险管家！";
				var url = shareObj.shareUrl || shareUrl;
				var shareDesc = shareObj.shareDesc || "诺贝保险管家，为您定制保险！";
				var shareImg = shareObj.shareImg ||"http://web.youbaowuxian.com/wx_share/img/share.jpg";

				var shareLink = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx526ab87a436ee1c3&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
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
						//alert(shareLink);
						//window.location.href = shareLink;
					},
					cancel: function() {}
				});
			});
			wx.error(function(res) {
				// alert(res);
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			});
		})
	},
	sendMail:function($http,$rootScope,url,openId,email,order_no){
				$http({
					method: 'POST',
					headers: {
						"Content-Type": "application/json;charset:UTF-8"
					},
					url: url,
					data: {
						"open_id": openId,
						"email": email,
						"order_no": order_no
					}
				}).then(function(res) {
					console.log(res);
					if (res.data && res.data.description) {
						util.showToast($rootScope, res.data.description);
					} else if (res.data.code === 0) {
						util.showToast($rootScope, "邮件发送成功，请注意查收");
					}
				}, function(res) {
					console.log(res);
					util.showToast($rootScope, "服务器错误");
				});
	}
}