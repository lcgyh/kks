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
        mkDiscount: null
    },
    onLoad: function(s) {
        var o = wx.getSystemInfoSync(), a = -1 != o.model.search("iPhone X");
        if (this.setData({
            mkDiscountId: s.mkDiscountId,
            systemInfo: o,
            isIphoneX: a
        }), void 0 == s.spShopId || "" == s.spShopId || null == s.spShopId) this.setData({
            userInfo: wx.getStorageSync("userInfo")
        }), this.requestMkDiscountInfo(), this.requestMkDiscountItemQuery(0); else {
            var i = this, u = "";
            void 0 != s.ucUserId && (u = s.ucUserId), wx.login({
                success: function(o) {
                    if (o.code) {
                        var a = {
                            code: o.code,
                            spShopId: s.spShopId,
                            ucUserId: u
                        };
                        t.default.networkRequest(e.kscUcUserWxLogin, a, function(t) {
                            wx.setStorage({
                                key: "userInfo",
                                data: t
                            }), i.setData({
                                userInfo: t
                            }), i.requestMkDiscountInfo(), i.requestMkDiscountItemQuery(0);
                        });
                    }
                }
            });
        }
    },
    onPullDownRefresh: function() {
        this.requestMkDiscountItemQuery(0);
    },
    onReachBottom: function() {
        this.data.page + 1 < this.data.totalPage && this.requestMkDiscountItemQuery(this.data.page + 1);
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.mkDiscount.title1 + " - " + t.data.mkDiscount.title2,
            path: "/pages/spu/activityTimeList/activityTimeList?spShopId=" + t.data.userInfo.ucUserShopinfo.customerShopId + "&ucUserId=" + t.data.userInfo.ucUserId + "&mkDiscountId=" + this.data.mkDiscountId,
            imageUrl: "../../../images/spu/item_activity_share.png"
        };
    },
    requestMkDiscountInfo: function(s) {
        var o = this, a = {
            mkDiscountId: this.data.mkDiscountId
        };
        t.default.networkRequest(e.kscMkDiscountInfo, a, function(t) {
            wx.stopPullDownRefresh(), o.data.mkDiscount = t.mkDiscount, wx.setNavigationBarTitle({
                title: t.mkDiscount.title1
            });
        });
    },
    requestMkDiscountItemQuery: function(s) {
        var o = this, a = {
            mkDiscountId: this.data.mkDiscountId
        };
        0 != s && (a.total = this.data.total, a.page = s), t.default.networkRequest(e.kscMkDiscountItemQuery, a, function(t) {
            wx.stopPullDownRefresh();
            var e = void 0;
            if (0 == s) e = t.result; else {
                if (o.data.page >= t.page) return;
                e = o.data.pageInfoList.concat(t.result);
            }
            o.setData({
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
    }
});