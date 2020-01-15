var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), a = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        cartInfo: [ {
            name: "门店现货",
            ocCartList: null,
            recommendParameter: {
                size: 10,
                groupType: 23,
                spuType: null
            },
            recommendList: []
        }, {
            name: "品牌直发",
            ocCartList: null,
            recommendParameter: {
                size: 10,
                groupType: 13,
                spuType: null
            },
            recommendList: []
        }, {
            name: "跨境保税",
            ocCartList: null,
            recommendParameter: {
                size: 10,
                groupType: null,
                spuType: 20
            },
            recommendList: []
        } ],
        cartListInfo: null,
        choosedIndex: 0,
        operationOcCartId: -1,
        startX: "",
        txtStyle: null,
        delBtnWidth: 206 * wx.getSystemInfoSync().windowWidth / 750,
        chooseAll: !1,
        chooseNum: 0,
        chooseAllPrice: 0
    },
    onLoad: function(t) {
        wx.hideShareMenu();
    },
    onShow: function() {
        this.requestOcCartList();
        for (var t = 0; t < 3; t++) this.requestPdItemK2bQuery(t);
        this.requestOcCartCount();
    },
    requestOcCartList: function(o) {
        var e = this, c = {
            mkDiscountId: this.data.mkDiscountId
        };
        t.default.networkRequest(a.kscOcCartList, c, function(t) {
            e.data.cartInfo[0].ocCartList = t.ocCartBToC, e.data.cartInfo[1].ocCartList = t.ocCartKToC, 
            e.data.cartInfo[2].ocCartList = t.ocCartFreeTax, e.data.choosedIndex = 0, 13 == t.nearCartTypeNum ? e.data.choosedIndex = 1 : 10 == t.nearCartTypeNum && (e.data.choosedIndex = 2), 
            e.data.chooseAll = !0, e.data.chooseNum = 0, e.data.chooseAllPrice = 0;
            for (var a = 0; a < e.data.cartInfo[e.data.choosedIndex].ocCartList.normal.length; a++) {
                e.data.cartInfo[e.data.choosedIndex].ocCartList.normal[a].choosed = e.data.chooseAll;
                var o = e.data.cartInfo[e.data.choosedIndex].ocCartList.normal[a];
                e.data.chooseAll && (e.data.chooseNum++, e.data.chooseAllPrice = e.data.chooseAllPrice + o.pdItemSku.discountRetailPrice * o.qty);
            }
            e.setData({
                cartInfo: e.data.cartInfo,
                chooseAll: e.data.chooseAll,
                chooseNum: e.data.chooseNum,
                chooseAllPrice: e.data.chooseAllPrice,
                choosedIndex: e.data.choosedIndex
            });
        });
    },
    requestPdItemK2bQuery: function(o) {
        var e = this;
        t.default.networkRequest(a.kscPdItemQuery, this.data.cartInfo[o].recommendParameter, function(t) {
            e.data.cartInfo[o].recommendList = t.result, e.setData({
                cartInfo: e.data.cartInfo
            });
        });
    },
    requestOcCartCount: function() {
        t.default.networkRequest(a.kscOcCartCount, null, function(t) {
            var a = t.itemCount;
            a > 0 ? (a = a > 99 ? "99+" : String(a), wx.setTabBarBadge({
                index: 2,
                text: a
            })) : wx.removeTabBarBadge({
                index: 2
            });
        });
    },
    handleChoosedIndex: function(t) {
        var a = t.currentTarget.dataset.index;
        if (this.data.choosedIndex != a) {
            for (var o = 0; o < this.data.cartInfo[this.data.choosedIndex].ocCartList.normal.length; o++) this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[o].choosed = !1;
            this.data.chooseAll = !0, this.data.chooseNum = 0, this.data.chooseAllPrice = 0;
            for (var e = 0; e < this.data.cartInfo[a].ocCartList.normal.length; e++) {
                this.data.cartInfo[a].ocCartList.normal[e].choosed = this.data.chooseAll;
                var c = this.data.cartInfo[a].ocCartList.normal[e];
                c.choosed ? (this.data.chooseNum++, this.data.chooseAllPrice = this.data.chooseAllPrice + c.pdItemSku.discountRetailPrice * c.qty) : this.data.chooseAll = !1;
            }
            this.setData({
                choosedIndex: a,
                cartInfo: this.data.cartInfo,
                chooseAll: this.data.chooseAll,
                chooseNum: this.data.chooseNum,
                chooseAllPrice: this.data.chooseAllPrice
            });
        }
    },
    goHomePage: function() {
        wx.switchTab({
            url: "../../spu/homePage/homePage"
        });
    },
    chooseCartButtonMethod: function(t) {
        this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[t.currentTarget.dataset.index].choosed = !this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[t.currentTarget.dataset.index].choosed, 
        this.data.chooseAll = !0, this.data.chooseNum = 0, this.data.chooseAllPrice = 0;
        for (var a = 0; a < this.data.cartInfo[this.data.choosedIndex].ocCartList.normal.length; a++) {
            var o = this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[a];
            o.choosed ? (this.data.chooseNum++, this.data.chooseAllPrice = this.data.chooseAllPrice + o.pdItemSku.discountRetailPrice * o.qty) : this.data.chooseAll = !1;
        }
        this.setData({
            cartInfo: this.data.cartInfo,
            chooseAll: this.data.chooseAll,
            chooseNum: this.data.chooseNum,
            chooseAllPrice: this.data.chooseAllPrice
        });
    },
    goSpuDetail: function(t) {
        wx.navigateTo({
            url: "../../spu/spuDetail/spuDetail?pdItemId=" + t.currentTarget.dataset.pditemid
        });
    },
    emptyTap: function() {},
    buyNumJian: function(o) {
        var e = o.currentTarget.dataset.index, c = this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[e];
        if (1 != c.qty) {
            var s = {
                ocCartId: c.ocCartId,
                qty: c.qty - 1
            }, r = this;
            t.default.networkRequest(a.kscOcCartSave, s, function(t) {
                r.data.cartInfo[r.data.choosedIndex].ocCartList.normal[e].qty = t.ocCart.qty, r.data.cartInfo[r.data.choosedIndex].ocCartList.normal[e].qtySaleAvaiable = t.ocCart.qtySaleAvaiable, 
                r.data.chooseNum = 0, r.data.chooseAllPrice = 0;
                for (var a = 0; a < r.data.cartInfo[r.data.choosedIndex].ocCartList.normal.length; a++) {
                    var o = r.data.cartInfo[r.data.choosedIndex].ocCartList.normal[a];
                    o.choosed && (r.data.chooseNum++, r.data.chooseAllPrice = r.data.chooseAllPrice + o.pdItemSku.discountRetailPrice * o.qty);
                }
                r.setData({
                    cartInfo: r.data.cartInfo,
                    chooseNum: r.data.chooseNum,
                    chooseAllPrice: r.data.chooseAllPrice
                });
            });
        }
    },
    buyNumJia: function(o) {
        var e = o.currentTarget.dataset.index, c = this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[e];
        if (99 != c.qty && c.qty != c.qtySaleAvaiable) {
            var s = {
                ocCartId: c.ocCartId,
                qty: c.qty + 1
            }, r = this;
            t.default.networkRequest(a.kscOcCartSave, s, function(t) {
                r.data.cartInfo[r.data.choosedIndex].ocCartList.normal[e].qty = t.ocCart.qty, r.data.cartInfo[r.data.choosedIndex].ocCartList.normal[e].qtySaleAvaiable = t.ocCart.qtySaleAvaiable, 
                r.data.chooseNum = 0, r.data.chooseAllPrice = 0;
                for (var a = 0; a < r.data.cartInfo[r.data.choosedIndex].ocCartList.normal.length; a++) {
                    var o = r.data.cartInfo[r.data.choosedIndex].ocCartList.normal[a];
                    o.choosed && (r.data.chooseNum++, r.data.chooseAllPrice = r.data.chooseAllPrice + o.pdItemSku.discountRetailPrice * o.qty);
                }
                r.setData({
                    cartInfo: r.data.cartInfo,
                    chooseNum: r.data.chooseNum,
                    chooseAllPrice: r.data.chooseAllPrice
                });
            });
        }
    },
    goSpuSearchList: function() {
        wx.navigateTo({
            url: "../../spu/spuSearchList/spuSearchList?groupType=23"
        });
    },
    chooseAllButtonMethod: function() {
        this.data.chooseAll = !this.data.chooseAll, this.data.chooseNum = 0, this.data.chooseAllPrice = 0;
        for (var t = 0; t < this.data.cartInfo[this.data.choosedIndex].ocCartList.normal.length; t++) {
            this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[t].choosed = this.data.chooseAll;
            var a = this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[t];
            this.data.chooseAll && (this.data.chooseNum++, this.data.chooseAllPrice = this.data.chooseAllPrice + a.pdItemSku.discountRetailPrice * a.qty);
        }
        this.setData({
            cartInfo: this.data.cartInfo,
            chooseAll: this.data.chooseAll,
            chooseNum: this.data.chooseNum,
            chooseAllPrice: this.data.chooseAllPrice
        });
    },
    goOrderButtonMethod: function() {
        for (var t = [], a = 0; a < this.data.cartInfo[this.data.choosedIndex].ocCartList.normal.length; a++) this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[a].choosed && t.push({
            ocCartId: this.data.cartInfo[this.data.choosedIndex].ocCartList.normal[a].ocCartId
        });
        if (0 != t.length) {
            var o = {
                ocCarts: t
            };
            wx.navigateTo({
                url: "../../order/orderConfirm/orderConfirm?needInfo=" + JSON.stringify(o)
            });
        } else wx.showToast({
            title: "没有选中的商品，无法结算",
            icon: "none"
        });
    },
    touchS: function(t) {
        1 == t.touches.length && this.setData({
            startX: t.touches[0].clientX
        });
    },
    touchM: function(t) {
        if (1 == t.touches.length) {
            var a = t.touches[0].clientX, o = this.data.startX - a, e = this.data.delBtnWidth, c = "";
            0 == o || o < 0 ? c = "left:0px" : o > 0 && (c = "left:-" + o + "px", o >= e && (c = "left:-" + e + "px")), 
            this.setData({
                operationOcCartId: t.currentTarget.dataset.occartid,
                txtStyle: c
            });
        }
    },
    touchE: function(t) {
        if (1 == t.changedTouches.length) {
            var a = t.changedTouches[0].clientX, o = this.data.startX - a, e = this.data.delBtnWidth, c = o > e / 2 ? "left:-" + e + "px" : "left:0px";
            this.setData({
                operationOcCartId: t.currentTarget.dataset.occartid,
                txtStyle: c
            });
        }
    },
    cellDeleteMethod: function(o) {
        var e = o.currentTarget.dataset.type, c = o.currentTarget.dataset.index, s = {
            ocCartId: this.data.cartInfo[this.data.choosedIndex].ocCartList[e][c].ocCartId
        }, r = this;
        t.default.networkRequest(a.kscOcCartDelete, s, function(t) {
            r.data.cartInfo[r.data.choosedIndex].ocCartList[e].splice(c, 1), r.setData({
                cartInfo: r.data.cartInfo
            }), r.requestOcCartCount();
        });
    }
});