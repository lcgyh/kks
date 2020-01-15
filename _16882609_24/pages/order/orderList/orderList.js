var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), s = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        systemInfo: null,
        isIphoneX: !1,
        active: 0,
        orderListInfo: []
    },
    onLoad: function(t) {
        wx.hideShareMenu();
        var s = wx.getSystemInfoSync(), e = -1 != s.model.search("iPhone X");
        this.data.orderListInfo = [ {
            statusTitle: "全部",
            showStatus: null,
            requestStatus: 0,
            orderList: [],
            page: -1,
            total: null
        }, {
            statusTitle: "待付款",
            showStatus: 10,
            requestStatus: 0,
            orderList: [],
            page: -1,
            total: null
        }, {
            statusTitle: "待发货",
            showStatus: 40,
            requestStatus: 0,
            orderList: [],
            page: -1,
            total: null
        }, {
            statusTitle: "待收货",
            showStatus: 60,
            requestStatus: 0,
            orderList: [],
            page: -1,
            total: null
        }, {
            statusTitle: "已完成",
            showStatus: 90,
            requestStatus: 0,
            orderList: [],
            page: -1,
            total: null
        }, {
            statusTitle: "已取消",
            showStatus: 21,
            requestStatus: 0,
            orderList: [],
            page: -1,
            total: null
        } ];
        for (var a = 0; a < this.data.orderListInfo.length; a++) {
            if (void 0 != t.showStatus && 80 == t.showStatus) {
                this.data.active = 4;
                break;
            }
            if (void 0 == t.showStatus || this.data.orderListInfo[a].showStatus == t.showStatus) {
                this.data.active = a;
                break;
            }
        }
        this.setData({
            systemInfo: s,
            isIphoneX: e,
            active: this.data.active,
            orderListInfo: this.data.orderListInfo
        });
    },
    onShow: function() {
        for (var t = 0; t < this.data.orderListInfo.length; t++) this.requestOcOrderQuery(t, !0);
    },
    requestOcOrderQuery: function(e, a) {
        var r = this, o = this.data.orderListInfo[e], u = void 0;
        u = a ? {
            showStatus: o.showStatus
        } : {
            total: o.total,
            showStatus: o.showStatus,
            page: o.page + 1
        }, t.default.networkRequest(s.kscOcOrderQuery, u, function(t) {
            for (var s = 0; s < t.result.length; s++) t.result[s].showStatusStyle = "", 10 == t.result[s].showStatus ? t.result[s].showStatusStyle = "#FB625D" : 40 == t.result[s].showStatus ? t.result[s].showStatusStyle = "#606FAC" : 60 == t.result[s].showStatus ? t.result[s].showStatusStyle = "#F3B356" : 80 == t.result[s].showStatus || 90 == t.result[s].showStatus ? t.result[s].showStatusStyle = "#30BE76" : t.result[s].showStatusStyle = "#C5C5C5", 
            90 == t.result[s].showStatus && 0 == t.result[s].commentStatus && (t.result[s].showStatus = 80, 
            t.result[s].showStatusStr = "待评价");
            o.requestStatus = 10, o.page = t.page, o.total = t.total, o.totalPage = t.totalPage, 
            o.orderList = a ? t.result : o.orderList.concat(t.result), r.data.orderListInfo[e] = o, 
            r.setData({
                orderListInfo: r.data.orderListInfo
            });
        });
    },
    bindscrolltoupper: function(t) {
        var s = t.currentTarget.dataset.index;
        this.requestOcOrderQuery(s, !0);
    },
    bindscrolltolower: function(t) {
        var s = t.currentTarget.dataset.index, e = this.data.orderListInfo[s];
        e.page + 1 < e.totalPage && this.requestOcOrderQuery(s);
    },
    goHomePage: function() {
        wx.switchTab({
            url: "../../spu/homePage/homePage"
        });
    },
    goOrderDetail: function(t) {
        wx.navigateTo({
            url: "../orderDetail/orderDetail?ocOrderId=" + t.currentTarget.dataset.ocorderid
        });
    }
});