var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), t = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        expressTraceInfo: null
    },
    onLoad: function(e) {
        wx.hideShareMenu();
        var t = wx.getSystemInfoSync(), s = -1 != t.model.search("iPhone X");
        this.setData({
            systemInfo: t,
            isIphoneX: s,
            options: e
        }), this.requestOcOrderExpressTrace();
    },
    requestOcOrderExpressTrace: function() {
        var s = this;
        e.default.networkRequest(t.kscOcOrderExpressTrace, this.data.options, function(e) {
            s.setData({
                expressTraceInfo: e
            });
        });
    },
    mainNoCopyButtonMethod: function() {
        var e = this;
        wx.setClipboardData({
            data: e.data.expressTraceInfo.mailNo,
            success: function(e) {
                wx.showToast({
                    title: "复制成功",
                    icon: "none"
                });
            }
        });
    }
});