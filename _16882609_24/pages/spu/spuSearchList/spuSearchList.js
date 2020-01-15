var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), e = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        keywords: "",
        spuPdCategory1Id: null,
        spuPdCategory2Id: null,
        spuList: [],
        page: 0,
        total: null,
        totalPage: null,
        requestStatus: 0,
        hideFilter: !0,
        choosedFilter: 0,
        filterAry: [ {
            name: "全部商品",
            groupType: null,
            spuType: null
        }, {
            name: "门店现货",
            groupType: 23,
            spuType: null
        }, {
            name: "品牌直发",
            groupType: 13,
            spuType: 10
        }, {
            name: "跨境保税",
            groupType: null,
            spuType: 20
        } ],
        inputFocus: null
    },
    onLoad: function(t) {
        wx.hideShareMenu();
        var e = wx.getSystemInfoSync(), a = -1 != e.model.search("iPhone X");
        t.onlySearch ? this.setData({
            inputFocus: !0,
            systemInfo: e,
            isIphoneX: a
        }) : t.searchAll ? (wx.setNavigationBarTitle({
            title: "全部商品"
        }), this.setData({
            systemInfo: e,
            isIphoneX: a
        }), this.requestPdItemK2bQuery(0)) : 23 == t.groupType ? (wx.setNavigationBarTitle({
            title: "门店现货"
        }), this.setData({
            systemInfo: e,
            isIphoneX: a,
            choosedFilter: 1
        }), this.requestPdItemK2bQuery(0)) : (void 0 != t.title && wx.setNavigationBarTitle({
            title: t.title
        }), void 0 != t.spuPdCategory1Id && (this.data.spuPdCategory1Id = t.spuPdCategory1Id), 
        void 0 != t.spuPdCategory2Id && (this.data.spuPdCategory2Id = t.spuPdCategory2Id), 
        this.setData({
            spuPdCategory1Id: this.data.spuPdCategory1Id,
            spuPdCategory2Id: this.data.spuPdCategory2Id,
            systemInfo: e,
            isIphoneX: a
        }), this.requestPdItemK2bQuery(0));
    },
    bindscrolltolower: function() {
        this.data.page + 1 < this.data.totalPage && this.requestPdItemK2bQuery(this.data.page + 1);
    },
    requestPdItemK2bQuery: function(a) {
        var s = this, i = {
            keywords: this.data.keywords,
            spuPdCategory1Id: this.data.spuPdCategory1Id,
            spuPdCategory2Id: this.data.spuPdCategory2Id,
            groupType: this.data.filterAry[this.data.choosedFilter].groupType,
            spuType: this.data.filterAry[this.data.choosedFilter].spuType
        };
        0 != a && (i.total = this.data.total, i.page = a), t.default.networkRequest(e.kscPdItemQuery, i, function(t) {
            if (0 == a) s.data.spuList = []; else if (s.data.page >= t.page) return;
            s.setData({
                page: t.page,
                totalPage: t.totalPage,
                total: t.total,
                spuList: s.data.spuList.concat(t.result),
                requestStatus: 10
            });
        });
    },
    goBackPage: function() {
        wx.navigateBack();
    },
    searchInput: function(t) {
        this.setData({
            keywords: t.detail.value
        });
    },
    bindconfirm: function() {
        0 != this.data.keywords.length && (this.setData({
            inputFocus: !1
        }), wx.setNavigationBarTitle({
            title: "搜索"
        }), this.data.spuPdCategory1Id = null, this.data.spuPdCategory2Id = null, this.requestPdItemK2bQuery(0));
    },
    clearInputImageMethod: function() {
        this.setData({
            keywords: ""
        });
    },
    hideFilterHandle: function() {
        this.setData({
            hideFilter: !this.data.hideFilter
        });
    },
    chooseFilter: function(t) {
        this.setData({
            choosedFilter: t.currentTarget.dataset.index,
            hideFilter: !0
        }), wx.setNavigationBarTitle({
            title: "搜索"
        }), this.requestPdItemK2bQuery(0);
    },
    noBind: function() {},
    goStockSpuDetail: function(t) {
        var e = t.currentTarget.dataset.pditemid;
        wx.navigateTo({
            url: "../../spu/spuDetail/spuDetail?pdItemId=" + e
        });
    }
});