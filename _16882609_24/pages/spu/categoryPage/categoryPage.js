var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), e = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        systemInfo: null,
        pdCategorys: null,
        keywords: "",
        choosedIndex: 0,
        chooseViewId: null
    },
    onLoad: function(t) {
        wx.hideShareMenu();
        var e = wx.getSystemInfoSync();
        this.setData({
            systemInfo: e
        });
    },
    onShow: function() {
        this.requestPdCategoryShoptree(), this.requestOcCartCount();
    },
    requestPdCategoryShoptree: function() {
        var a = this;
        t.default.networkRequest(e.kscPdCategoryShoptree, null, function(t) {
            a.setData({
                pdCategorys: t.pdCategorys
            }, function() {
                setTimeout(function() {
                    for (var t = 0, e = 0; e < a.data.pdCategorys.length; e++) !function(e) {
                        var r = "#theId" + e, o = wx.createSelectorQuery();
                        o.select(r).boundingClientRect(), o.exec(function(r) {
                            t += r[0].height, a.data.pdCategorys[e].bottomPosition = t;
                        });
                    }(e);
                }, 500);
            });
        });
    },
    requestOcCartCount: function() {
        t.default.networkRequest(e.kscOcCartCount, null, function(t) {
            var e = t.itemCount;
            e > 0 ? (e = e > 99 ? "99+" : String(e), wx.setTabBarBadge({
                index: 2,
                text: e
            })) : wx.removeTabBarBadge({
                index: 2
            });
        });
    },
    searchInput: function(t) {
        this.setData({
            keywords: t.detail.value
        });
    },
    searchGoSpuSearchList: function(t) {
        wx.navigateTo({
            url: "../../spu/spuSearchList/spuSearchList?onlySearch=true"
        });
    },
    clearInputImageMethod: function() {
        this.setData({
            keywords: ""
        });
    },
    leftViewCellMethod: function(t) {
        this.setData({
            choosedIndex: t.currentTarget.dataset.index,
            chooseViewId: "theId" + t.currentTarget.dataset.index
        });
    },
    categorysButtonMethod: function(t) {
        var e = t.currentTarget.dataset.superindex, a = "?spuPdCategory1Id=" + this.data.pdCategorys[e].pdCategoryId;
        if (void 0 == t.currentTarget.dataset.index) a = a + "&title=" + this.data.pdCategorys[e].name; else {
            var r = t.currentTarget.dataset.index;
            a = a + "&spuPdCategory2Id=" + this.data.pdCategorys[e].childrenList[r].pdCategoryId + "&title=" + this.data.pdCategorys[e].childrenList[r].name;
        }
        wx.navigateTo({
            url: "../../spu/spuSearchList/spuSearchList" + a
        });
    },
    bindscrollRightScroll: function(t) {
        for (var e = 0; e < this.data.pdCategorys.length; e++) for (var a = t.detail.scrollTop, r = 0; r < this.data.pdCategorys.length; r++) if (this.data.pdCategorys[r].bottomPosition > a) {
            this.setData({
                choosedIndex: r
            });
            break;
        }
    }
});