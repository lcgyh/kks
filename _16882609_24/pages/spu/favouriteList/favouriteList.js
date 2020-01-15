var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), e = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        requestStatus: 0,
        page: null,
        total: null,
        totalPage: null,
        dataList: [],
        operationPdItemId: -1,
        startX: "",
        txtStyle: null,
        delBtnWidth: null
    },
    onLoad: function(t) {
        wx.hideShareMenu();
        var e = 206 * wx.getSystemInfoSync().windowWidth / 750;
        this.setData({
            delBtnWidth: e
        }), this.requestFavoriteQuery(0);
    },
    onPullDownRefresh: function() {
        this.requestFavoriteQuery(0);
    },
    onReachBottom: function() {
        this.data.page + 1 < this.data.totalPage && this.requestFavoriteQuery(this.data.page + 1);
    },
    requestFavoriteQuery: function(a) {
        var i = this, s = void 0;
        s = 0 == a ? null : {
            total: this.data.total,
            page: a
        }, t.default.networkRequest(e.kscUcsSubscribeFavoriteQuery, s, function(t) {
            wx.stopPullDownRefresh();
            var e = void 0;
            e = 0 == a ? t.result : i.data.dataList.concat(t.result), i.setData({
                page: t.page,
                totalPage: t.totalPage,
                total: t.total,
                dataList: e,
                requestStatus: 10
            });
        });
    },
    spuCellTap: function(t) {
        wx.navigateTo({
            url: "../spuDetail/spuDetail?pdItemId=" + t.currentTarget.dataset.pditemid
        });
    },
    touchS: function(t) {
        1 == t.touches.length && this.setData({
            startX: t.touches[0].clientX
        });
    },
    touchM: function(t) {
        if (1 == t.touches.length) {
            var e = t.touches[0].clientX, a = this.data.startX - e, i = this.data.delBtnWidth, s = "";
            0 == a || a < 0 ? s = "left:0px" : a > 0 && (s = "left:-" + a + "px", a >= i && (s = "left:-" + i + "px")), 
            this.setData({
                operationPdItemId: t.currentTarget.dataset.pditemid,
                txtStyle: s
            });
        }
    },
    touchE: function(t) {
        if (1 == t.changedTouches.length) {
            var e = t.changedTouches[0].clientX, a = this.data.startX - e, i = this.data.delBtnWidth, s = a > i / 2 ? "left:-" + i + "px" : "left:0px";
            this.setData({
                operationPdItemId: t.currentTarget.dataset.pditemid,
                txtStyle: s
            });
        }
    },
    cellDeleteMethod: function(a) {
        var i = {
            pdItemId: a.currentTarget.dataset.pditemid
        }, s = this;
        t.default.networkRequest(e.kscUcSubscribeFavoriteDelete, i, function(t) {
            var e = s.data.dataList;
            e.splice(a.currentTarget.dataset.index, 1), s.setData({
                dataList: e
            });
        });
    },
    goHomePage: function() {
        wx.switchTab({
            url: "../../spu/homePage/homePage"
        });
    }
});