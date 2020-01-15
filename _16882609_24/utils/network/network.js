var e = require("./urlMacroFile.js"), o = {
    networkRequest: function(o, t, n, s) {
        var c = this, i = wx.getStorageSync("sessionId");
        o == e.kscUcUserWxLogin || i ? wx.getNetworkType({
            success: function(i) {
                "getNetworkType:ok" === i.errMsg && "none" != i.networkType ? wx.request({
                    url: e.host + "?code=" + o,
                    header: {
                        Cookie: "SESSION=" + wx.getStorageSync("sessionId")
                    },
                    data: t,
                    method: "POST",
                    success: function(i) {
                        200 === i.statusCode ? "0" === i.data.code ? (o === e.kscUcUserWxLogin && wx.setStorageSync("sessionId", i.data.sessionId), 
                        "function" == typeof n && n(i.data.data)) : "E_NEED_LOGIN" == i.data.code && o != e.kscUcUserWxLogin ? c.loginNoUseHandle(o, t, n, s) : (null != s && s && "function" == typeof s && s(), 
                        wx.showToast({
                            title: i.data.message,
                            icon: "none"
                        })) : (null != s && s && "function" == typeof s && s(), wx.showToast({
                            title: "服务器好像开小差了，请你稍后再试...",
                            icon: "none"
                        }));
                    },
                    fail: function(e) {
                        null != s && s && "function" == typeof s && s(), wx.showToast({
                            title: "服务器好像开小差了，请你稍后再试...",
                            icon: "none"
                        });
                    }
                }) : wx.showToast({
                    title: "啊哦~网络连接好像出问题了，让咱们一起检查检查再试吧...",
                    icon: "none"
                });
            }
        }) : this.loginNoUseHandle(o, t, n, s);
    },
    loginNoUseHandle: function(o, t, n, s) {
        var c = this;
        wx.login({
            success: function(i) {
                var a = {
                    code: i.code
                };
                c.networkRequest(e.kscUcUserWxLogin, a, function(e) {
                    wx.setStorage({
                        key: "userInfo",
                        data: i
                    }), c.networkRequest(o, t, n, s);
                });
            }
        });
    }
};

module.exports = o;