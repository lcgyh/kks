var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), o = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        shopList: null,
        chooseSpShopId: null
    },
    onLoad: function(t) {
        wx.hideShareMenu();
        var s = this, u = wx.getStorageSync("userInfo");
        u ? this.setData({
            chooseSpShopId: u.ucUserShopinfo.customerShopId
        }) : wx.login({
            success: function(t) {
                var u = {
                    code: t.code
                };
                e.default.networkRequest(o.kscUcUserWxLogin, u, function(e) {
                    wx.setStorage({
                        key: "userInfo",
                        data: e
                    }), s.setData({
                        chooseSpShopId: e.ucUserShopinfo.customerShopId
                    });
                });
            }
        }), this.requestSpShopCustomerList();
    },
    requestSpShopCustomerList: function() {
        var t = this;
        e.default.networkRequest(o.kscSpShopCustomerList, null, function(e) {
            t.setData({
                shopList: e.spShopCustomers
            });
        });
    },
    cellChooseShop: function(t) {
        var s = t.currentTarget.dataset.spshopid;
        if (s != this.data.chooseSpShopId) {
            var u = {
                spShopId: s
            };
            e.default.networkRequest(o.kscSpShopCustomerSave, u, function(e) {
                wx.setStorage({
                    key: "userInfo",
                    data: e
                }), wx.reLaunch({
                    url: "../../spu/homePage/homePage"
                });
            });
        }
    }
});