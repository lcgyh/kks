var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), t = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        spShop: null
    },
    onLoad: function(n) {
        wx.hideShareMenu();
        var o = this;
        e.default.networkRequest(t.kscSpShopInfo, null, function(e) {
            var t = e.spShop, n = new Date(t.openTime), a = n.getFullYear() + "年" + (n.getMonth() + 1) + "月" + n.getDate() + "日";
            o.setData({
                openTime: a,
                spShop: t
            });
        });
    },
    phoneCall: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.spShop.contactTel
        });
    }
});