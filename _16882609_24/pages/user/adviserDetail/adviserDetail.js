var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), e = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        pageInfo: null,
        orderList: null,
        page: 0,
        total: null,
        totalPage: null
    },
    onLoad: function(t) {
        wx.hideShareMenu(), this.requestUcUserIndex(), this.requestOcOrderQuery(0);
    },
    onReachBottom: function() {
        this.data.page + 1 < this.data.totalPage && this.requestOcOrderQuery(this.data.page + 1);
    },
    requestUcUserIndex: function() {
        var r = this;
        t.default.networkRequest(e.kscUcUserIndex, null, function(t) {
            r.setData({
                pageInfo: t
            });
        });
    },
    requestOcOrderQuery: function(r) {
        var a = this, s = {
            queryType: 2
        };
        0 != r && (s.total = this.data.total, s.page = r), t.default.networkRequest(e.kscOcOrderQuery, s, function(t) {
            for (var e = 0; e < t.result.length; e++) t.result[e].showStatusStyle = "", 10 == t.result[e].showStatus ? t.result[e].showStatusStyle = "#FB625D" : 40 == t.result[e].showStatus ? t.result[e].showStatusStyle = "#606FAC" : 60 == t.result[e].showStatus ? t.result[e].showStatusStyle = "#F3B356" : 80 == t.result[e].showStatus || 90 == t.result[e].showStatus ? t.result[e].showStatusStyle = "#30BE76" : t.result[e].showStatusStyle = "#C5C5C5";
            var s = void 0;
            if (0 == r) s = t.result; else {
                if (a.data.page >= t.page) return;
                s = a.data.orderList.concat(t.result);
            }
            a.setData({
                page: t.page,
                totalPage: t.totalPage,
                total: t.total,
                orderList: s
            });
        });
    },
    goOrderDetail: function(t) {
        wx.navigateTo({
            url: "../../order/orderDetail/orderDetail?ocOrderId=" + t.currentTarget.dataset.ocorderid
        });
    }
});