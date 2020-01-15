var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), e = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        mkDiscountId: null,
        page: null,
        total: null,
        totalPage: null,
        pageInfoList: [],
        mkDiscount: null,
        nowTime: null,
        limitTimeInfo: {
            hours: "",
            minutes: "",
            seconds: ""
        },
        limitTimeSameTime: !1,
        activeEnd: !1
    },
    onLoad: function(i) {
        var a = wx.getSystemInfoSync(), n = -1 != a.model.search("iPhone X");
        if (this.setData({
            mkDiscountId: i.mkDiscountId,
            systemInfo: a,
            isIphoneX: n
        }), void 0 == i.spShopId || "" == i.spShopId || null == i.spShopId) this.setData({
            userInfo: wx.getStorageSync("userInfo")
        }), this.requestMkDiscountInfo(), this.requestMkDiscountItemQuery(0); else {
            var o = this, s = "";
            void 0 != i.ucUserId && (s = i.ucUserId), wx.login({
                success: function(a) {
                    if (a.code) {
                        var n = {
                            code: a.code,
                            spShopId: i.spShopId,
                            ucUserId: s
                        };
                        t.default.networkRequest(e.kscUcUserWxLogin, n, function(t) {
                            wx.setStorage({
                                key: "userInfo",
                                data: t
                            }), o.setData({
                                userInfo: t
                            }), o.requestMkDiscountInfo(), o.requestMkDiscountItemQuery(0);
                        });
                    }
                }
            });
        }
    },
    onShow: function() {
        var t = this;
        this.data.intervarID = setInterval(function() {
            if (null != t.data.mkDiscount) {
                var e = Date.parse(new Date()), i = t.data.mkDiscount.endTime - Date.parse(new Date());
                t.data.mkDiscount.startTime > e ? (i = t.data.mkDiscount.startTime - e, t.data.activeEnd = !1) : t.data.mkDiscount.endTime > e ? (i = t.data.mkDiscount.endTime - e, 
                t.data.activeEnd = !1) : (i = 0, t.data.activeEnd = !0), t.data.limitTimeInfo.hours = Math.floor(i / 1e3 / 60 / 60), 
                t.data.limitTimeInfo.minutes = Math.floor(i / 1e3 / 60 % 60), t.data.limitTimeInfo.seconds = Math.floor(i / 1e3 % 60), 
                t.data.limitTimeInfo.hours = t.data.limitTimeInfo.hours < 10 ? "0" + t.data.limitTimeInfo.hours : t.data.limitTimeInfo.hours, 
                t.data.limitTimeInfo.hours = t.data.limitTimeInfo.hours > 99 ? "99" : t.data.limitTimeInfo.hours, 
                t.data.limitTimeInfo.minutes = t.data.limitTimeInfo.minutes < 10 ? "0" + t.data.limitTimeInfo.minutes : t.data.limitTimeInfo.minutes, 
                t.data.limitTimeInfo.seconds = t.data.limitTimeInfo.seconds < 10 ? "0" + t.data.limitTimeInfo.seconds : t.data.limitTimeInfo.seconds;
                var a = new Date(t.data.mkDiscount.startTime), n = new Date(t.data.mkDiscount.endTime);
                a.getFullYear() == n.getFullYear() && a.getMonth() + 1 == n.getMonth() + 1 && a.getDate() == n.getDate() ? t.data.limitTimeSameTime = !0 : t.data.limitTimeSameTime = !1, 
                t.setData({
                    limitTimeInfo: t.data.limitTimeInfo,
                    nowTime: e,
                    activeEnd: t.data.activeEnd,
                    limitTimeSameTime: t.data.limitTimeSameTime
                });
            }
        }, 1e3);
    },
    onHide: function() {
        clearInterval(this.data.intervarID);
    },
    onPullDownRefresh: function() {
        this.requestMkDiscountInfo(), this.requestMkDiscountItemQuery(0);
    },
    onReachBottom: function() {
        this.data.page + 1 < this.data.totalPage && this.requestMkDiscountItemQuery(this.data.page + 1);
    },
    onShareAppMessage: function() {
        var t = this, e = new Date(t.data.mkDiscount.startTime), i = e.getMonth() + 1;
        i = i < 10 ? "0" + i : i;
        var a = e.getDate();
        a = a < 10 ? "0" + a : a;
        var n = e.getHours();
        n = n < 10 ? "0" + n : n;
        var o = e.getMinutes(), s = i + "月" + a + "日" + n + ":" + (o = o < 10 ? "0" + o : o) + "~", m = new Date(t.data.mkDiscount.endTime), u = m.getMonth() + 1;
        u = u < 10 ? "0" + u : u;
        var d = m.getDate();
        d = d < 10 ? "0" + d : d;
        var r = m.getHours();
        r = r < 10 ? "0" + r : r;
        var l = m.getMinutes();
        return l = l < 10 ? "0" + l : l, this.data.limitTimeSameTime || (s = s + u + "月" + d + "日"), 
        s = s + r + ":" + l, {
            title: t.data.mkDiscount.title2 + " - " + s + " 限时折扣",
            path: "/pages/spu/limitTimeList/limitTimeList?spShopId=" + t.data.userInfo.ucUserShopinfo.customerShopId + "&ucUserId=" + t.data.userInfo.ucUserId + "&mkDiscountId=" + this.data.mkDiscountId,
            imageUrl: "../../../images/spu/item_limit_share.png"
        };
    },
    requestMkDiscountInfo: function(i) {
        var a = this, n = {
            mkDiscountId: this.data.mkDiscountId
        };
        t.default.networkRequest(e.kscMkDiscountInfo, n, function(t) {
            wx.stopPullDownRefresh(), a.data.mkDiscount = t.mkDiscount, wx.setNavigationBarTitle({
                title: a.data.mkDiscount.title1
            });
            var e = Date.parse(new Date()), i = a.data.mkDiscount.endTime - Date.parse(new Date());
            a.data.mkDiscount.startTime > e ? (i = a.data.mkDiscount.startTime - e, a.data.activeEnd = !1) : a.data.mkDiscount.endTime > e ? (i = a.data.mkDiscount.endTime - e, 
            a.data.activeEnd = !1) : (i = 0, a.data.activeEnd = !0), a.data.limitTimeInfo.hours = Math.floor(i / 1e3 / 60 / 60), 
            a.data.limitTimeInfo.minutes = Math.floor(i / 1e3 / 60 % 60), a.data.limitTimeInfo.seconds = Math.floor(i / 1e3 % 60), 
            a.data.limitTimeInfo.hours = a.data.limitTimeInfo.hours < 10 ? "0" + a.data.limitTimeInfo.hours : a.data.limitTimeInfo.hours, 
            a.data.limitTimeInfo.hours = a.data.limitTimeInfo.hours > 99 ? "99" : a.data.limitTimeInfo.hours, 
            a.data.limitTimeInfo.minutes = a.data.limitTimeInfo.minutes < 10 ? "0" + a.data.limitTimeInfo.minutes : a.data.limitTimeInfo.minutes, 
            a.data.limitTimeInfo.seconds = a.data.limitTimeInfo.seconds < 10 ? "0" + a.data.limitTimeInfo.seconds : a.data.limitTimeInfo.seconds;
            var n = new Date(a.data.mkDiscount.startTime), o = new Date(a.data.mkDiscount.endTime);
            n.getFullYear() == o.getFullYear() && n.getMonth() + 1 == o.getMonth() + 1 && n.getDate() == o.getDate() ? a.data.limitTimeSameTime = !0 : a.data.limitTimeSameTime = !1, 
            a.setData({
                mkDiscount: a.data.mkDiscount,
                limitTimeInfo: a.data.limitTimeInfo,
                nowTime: e,
                activeEnd: a.data.activeEnd,
                limitTimeSameTime: a.data.limitTimeSameTime
            });
        });
    },
    requestMkDiscountItemQuery: function(i) {
        var a = this, n = {
            mkDiscountId: this.data.mkDiscountId
        };
        0 != i && (n.total = this.data.total, n.page = i), t.default.networkRequest(e.kscMkDiscountItemQuery, n, function(t) {
            var e = void 0;
            if (0 == i) e = t.result; else {
                if (a.data.page >= t.page) return;
                e = a.data.pageInfoList.concat(t.result);
            }
            a.setData({
                page: t.page,
                totalPage: t.totalPage,
                total: t.total,
                pageInfoList: e
            });
        });
    },
    spuCellTap: function(t) {
        wx.navigateTo({
            url: "../../spu/spuDetail/spuDetail?pdItemId=" + t.currentTarget.dataset.pditemid
        });
    },
    goBackPage: function() {
        wx.navigateBack();
    }
});