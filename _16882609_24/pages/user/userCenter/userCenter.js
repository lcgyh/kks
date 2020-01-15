var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), t = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        systemInfo: null,
        pageInfo: null,
        orderStatusAry: [ {
            status: 10,
            statusStr: "待付款"
        }, {
            status: 40,
            statusStr: "待发货"
        }, {
            status: 60,
            statusStr: "待收货"
        }, {
            status: 80,
            statusStr: "待评价"
        } ]
    },
    onLoad: function(e) {
        wx.hideShareMenu();
        var t = wx.getSystemInfoSync();
        this.setData({
            systemInfo: t
        });
    },
    onShow: function() {
        this.requestUcUserIndex(), this.requestOcCartCount();
    },
    requestUcUserIndex: function() {
        var a = this;
        e.default.networkRequest(t.kscUcUserIndex, null, function(e) {
            a.data.orderStatusAry[0].num = e.waitPay, a.data.orderStatusAry[2].num = e.waitReceive, 
            a.data.orderStatusAry[3].num = e.waitComment, a.setData({
                pageInfo: e,
                orderStatusAry: a.data.orderStatusAry
            });
        });
    },
    requestOcCartCount: function() {
        e.default.networkRequest(t.kscOcCartCount, null, function(e) {
            var t = e.itemCount;
            t > 0 ? (t = t > 99 ? "99+" : String(t), wx.setTabBarBadge({
                index: 2,
                text: t
            })) : wx.removeTabBarBadge({
                index: 2
            });
        });
    },
    bindGetUserInfo: function(e) {
        var t = this;
        "getUserInfo:ok" == e.detail.errMsg && wx.login({
            success: function(a) {
                var o = {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    code: a.code
                };
                t.updateUserInfo(o);
            }
        });
    },
    updateUserInfo: function(a) {
        var o = this;
        e.default.networkRequest(t.kscUcUserWxLogin, a, function(e) {
            void 0 != o.data.pageInfo.ucUser.headUrl && "" != o.data.pageInfo.ucUser.headUrl && wx.showToast({
                title: "资料已更新",
                icon: "none"
            }), o.data.pageInfo.ucUser = e, o.setData({
                pageInfo: o.data.pageInfo
            }), wx.setStorage({
                key: "userInfo",
                data: e
            });
        });
    },
    goAdviserDetail: function() {
        wx.navigateTo({
            url: "../../user/adviserDetail/adviserDetail"
        });
    },
    goOrderList: function(e) {
        var t = e.currentTarget.dataset.showstatus;
        "" != t && void 0 != t ? wx.navigateTo({
            url: "../../order/orderList/orderList?showStatus=" + t
        }) : wx.navigateTo({
            url: "../../order/orderList/orderList"
        });
    },
    updateIconInfo: function(a) {
        var o = this;
        e.default.networkRequest(t.kscUcUserWxLogin, a, function(e) {
            o.data.pageInfo.ucUser = e, o.setData({
                pageInfo: o.data.pageInfo
            }), wx.setStorage({
                key: "userInfo",
                data: e
            });
        });
    },
    bindGetUserInfoFavourite: function(e) {
        var t = this;
        "getUserInfo:ok" == e.detail.errMsg ? wx.login({
            success: function(a) {
                var o = {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    code: a.code
                };
                t.updateIconInfo(o), t.goFavouriteListPage();
            },
            fail: function(e) {
                t.goFavouriteListPage();
            }
        }) : this.goFavouriteListPage();
    },
    goFavouriteListPage: function() {
        wx.navigateTo({
            url: "../../spu/favouriteList/favouriteList"
        });
    },
    goIdCertificationPage: function() {
        wx.navigateTo({
            url: "../../order/idCertification/idCertification?userCenter=true"
        });
    },
    getPhoneNumber: function(a) {
        var o = this;
        "getPhoneNumber:ok" === a.detail.errMsg && wx.login({
            success: function(n) {
                if (n.code) {
                    var r = {
                        encryptedData: a.detail.encryptedData,
                        iv: a.detail.iv,
                        code: n.code
                    };
                    e.default.networkRequest(t.kscUcUserWxBindmobile, r, function(e) {
                        wx.setStorage({
                            key: "userInfo",
                            data: e
                        }), o.requestUcUserIndex();
                    });
                }
            }
        });
    },
    goToBApplet: function() {
        wx.navigateToMiniProgram({
            appId: "wx18a25c0972e86509",
            path: "/pages/user/login/login?spShopId=" + this.data.pageInfo.ucUser.ucUserShopinfo.customerShopId
        });
    },
    phoneCall: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.pageInfo.consultant.myShopConsultant.consultantUser.mobile
        });
    },
    goAboutShop: function() {
        wx.navigateTo({
            url: "../../user/aboutShop/aboutShop"
        });
    },
    goRecommend: function() {
        wx.navigateTo({
            url: "../../user/recommend/recommend"
        });
    },
    goChangeShop: function() {
        wx.navigateTo({
            url: "../../user/changeShop/changeShop"
        });
    }
});