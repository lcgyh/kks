var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), t = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        shopInfo: null,
        sharePicCodeUrl: null,
        shareUrl: null,
        spShopConsultant: null
    },
    onLoad: function(o) {
        var n = this, s = wx.getStorageSync("userInfo");
        s ? this.requestSpShopInfo(s) : wx.login({
            success: function(o) {
                var a = {
                    code: o.code
                };
                e.default.networkRequest(t.kscUcUserWxLogin, a, function(e) {
                    wx.setStorage({
                        key: "userInfo",
                        data: e
                    }), n.requestSpShopInfo(s);
                });
            }
        });
    },
    requestSpShopInfo: function(o) {
        var n = o, s = this;
        e.default.networkRequest(t.kscSpShopInfo, null, function(e) {
            void 0 != e.spShopConsultant && (s.data.spShopConsultant = e.spShopConsultant);
            var t = "b_" + e.spShop.spShopId + "_" + n.ucUserId;
            s.setData({
                shopInfo: e.spShop,
                userInfo: n,
                systemInfo: wx.getSystemInfoSync(),
                sharePicCodeUrl: "https://app.kkid.vip/kshop-appc/weixincode.htm?scene=" + encodeURIComponent(t) + "&width=204&isHyaline=true",
                spShopConsultant: s.data.spShopConsultant
            }, function() {
                setTimeout(function() {
                    s.createSharePic();
                }, 500);
            });
        });
    },
    onShareAppMessage: function() {
        var e = this;
        return {
            title: e.data.shopInfo.sname + " × KKID",
            path: "/pages/user/login/login?spShopId=" + e.data.shopInfo.spShopId + "&ucUserId=" + e.data.userInfo.ucUserId,
            imageUrl: "../../../images/spu/home_share_pic.png"
        };
    },
    createSharePic: function() {
        var e = this, t = new Promise(function(e, t) {
            wx.getImageInfo({
                src: "../../../images/user/recommend.png",
                success: function(t) {
                    e(t);
                }
            });
        }), o = new Promise(function(t, o) {
            wx.getImageInfo({
                src: e.data.sharePicCodeUrl,
                success: function(e) {
                    t(e);
                }
            });
        });
        Promise.all([ t, o ]).then(function(t) {
            var o = wx.createCanvasContext("shareImg");
            o.drawImage("../../../" + t[0].path, 0, 0, 750, 1334), o.drawImage(t[1].path, 273, 806, 204, 204), 
            o.setTextAlign("left"), o.setFillStyle("#ffffff"), o.setFontSize(52), o.setTextBaseline("top"), 
            o.fillText(e.data.shopInfo.name, 40, 248.5, 630), o.fillText(e.data.shopInfo.name, 40.5, 248, 630), 
            o.fillText(e.data.shopInfo.name, 40, 248, 630), o.fillText(e.data.shopInfo.name, 40, 247.5, 630), 
            o.fillText(e.data.shopInfo.name, 39.5, 248, 630), o.setFontSize(20), o.setTextBaseline("top"), 
            o.setGlobalAlpha(.5), o.fillText(e.data.shopInfo.city.name + e.data.shopInfo.area.name + e.data.shopInfo.address, 40, 430, 630), 
            o.stroke(), o.draw(), setTimeout(function() {
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 750,
                    height: 1334,
                    destWidth: 750,
                    destHeight: 1334,
                    canvasId: "shareImg",
                    success: function(t) {
                        wx.hideLoading(), e.setData({
                            shareUrl: t.tempFilePath
                        });
                    }
                });
            }, 2e3);
        });
    },
    savePhoto: function() {
        null == this.data.shareUrl ? wx.showToast({
            title: "海报正在生成，请稍后再试...",
            icon: "none"
        }) : this.saveImageToPhoto();
    },
    saveImageToPhoto: function() {
        var e = this;
        wx.saveImageToPhotosAlbum({
            filePath: e.data.shareUrl,
            success: function(e) {
                wx.showToast({
                    title: "已保存到手机相册，赶快去分享吧~",
                    icon: "none"
                });
            },
            fail: function(e) {
                wx.showModal({
                    title: "授权提示",
                    content: "保存海报到手机相册需要你的微信授权，请在设置中授权「相册」。",
                    confirmColor: "#5f7fdc",
                    success: function(e) {
                        e.confirm && wx.openSetting();
                    }
                });
            }
        });
    }
});