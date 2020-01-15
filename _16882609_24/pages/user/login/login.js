var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), t = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        loginFail: !1,
        options: null
    },
    onLoad: function(e) {
        if (wx.hideShareMenu(), void 0 != e.scene && null != e.scene && "" != e.scene) {
            var t = decodeURIComponent(e.scene).split("_"), o = {};
            "a" == t[0] ? (o = {
                pageType: 6e3,
                pdItemId: t[1],
                spShopId: t[2]
            }, t.length > 3 && (o.ucUserId = t[3])) : "b" == t[0] && (o = {
                spShopId: t[1]
            }, t.length > 2 && (o.ucUserId = t[2])), this.setData({
                options: o
            });
        } else this.setData({
            options: e
        });
        this.againLoginButtonMethod();
    },
    againLoginButtonMethod: function() {
        var o = this, a = this, s = "";
        void 0 != this.data.options.ucUserId && (s = this.data.options.ucUserId), wx.login({
            success: function(i) {
                if (i.code) {
                    var n = {
                        code: i.code,
                        spShopId: o.data.options.spShopId,
                        consultantUserId: s
                    };
                    e.default.networkRequest(t.kscUcUserWxLogin, n, function(e) {
                        a.pageChange(e);
                    }, function(e) {
                        a.setData({
                            loginFail: !0
                        });
                    });
                }
            },
            fail: function(e) {
                a.setData({
                    loginFail: !0
                });
            }
        });
    },
    pageChange: function(e) {
        if (6e3 == this.data.options.pageType) {
            var t = "";
            this.data.options.shareSheetShow && (t = "&shareSheetShow=true"), wx.reLaunch({
                url: "../../spu/spuDetail/spuDetail?pdItemId=" + this.data.options.pdItemId + "&backFirst=true" + t
            });
        } else 8e3 == this.data.options.pageType ? wx.reLaunch({
            url: "../../order/orderDetail/orderDetail?ocOrderId=" + this.data.options.ocOrderId + "&backFirst=true"
        }) : wx.switchTab({
            url: "../../spu/homePage/homePage"
        });
        wx.setStorage({
            key: "userInfo",
            data: e
        });
    }
});