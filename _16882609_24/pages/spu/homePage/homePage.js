var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), t = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        systemInfo: wx.getSystemInfoSync(),
        userInfo: null,
        headerInfo: null,
        pageItemInfo: null,
        navBarHidden: !0,
        goTopButtonHidden: !0,
        swiperCurrent: 0,
        intervarID: null,
        addMineHidden: !0
    },
    onLoad: function(e) {
        var t = wx.getSystemInfoSync(), a = !0;
        10 != wx.getStorageSync("addMineHidden") && (a = !1, wx.setStorage({
            key: "addMineHidden",
            data: "10"
        })), this.setData({
            systemInfo: t,
            addMineHidden: a
        }), this.requestSpShopIndex(), this.requestSpShopIndexItem(), this.autoUpdate();
    },
    onShow: function() {
        var a = wx.getStorageSync("userInfo");
        if (a) this.setData({
            userInfo: a
        }); else {
            var n = this;
            wx.login({
                success: function(o) {
                    var i = {
                        code: o.code
                    };
                    e.default.networkRequest(t.kscUcUserWxLogin, i, function(e) {
                        wx.setStorage({
                            key: "userInfo",
                            data: e
                        }), n.setData({
                            userInfo: a
                        });
                    });
                }
            });
        }
        var o = this;
        this.data.intervarID = setInterval(function() {
            var e = Date.parse(new Date());
            if (null != o.data.pageItemInfo) for (var t = 0; t < o.data.pageItemInfo.length; t++) if (10 == o.data.pageItemInfo[t].type || 11 == o.data.pageItemInfo[t].type) {
                o.data.pageItemInfo[t].limitTimeInfo = {
                    hours: "",
                    minutes: "",
                    seconds: ""
                }, o.data.pageItemInfo[t].limitTimeSameTime = !1;
                var a = o.data.pageItemInfo[t].endTime - Date.parse(new Date());
                o.data.pageItemInfo[t].startTime > e ? a = o.data.pageItemInfo[t].startTime - e : o.data.pageItemInfo[t].endTime > e ? a = o.data.pageItemInfo[t].endTime - e : (a = 0, 
                o.requestSpShopIndexItem()), o.data.pageItemInfo[t].limitTimeInfo.hours = Math.floor(a / 1e3 / 60 / 60), 
                o.data.pageItemInfo[t].limitTimeInfo.minutes = Math.floor(a / 1e3 / 60 % 60), o.data.pageItemInfo[t].limitTimeInfo.seconds = Math.floor(a / 1e3 % 60), 
                o.data.pageItemInfo[t].limitTimeInfo.hours = o.data.pageItemInfo[t].limitTimeInfo.hours < 10 ? "0" + o.data.pageItemInfo[t].limitTimeInfo.hours : o.data.pageItemInfo[t].limitTimeInfo.hours, 
                o.data.pageItemInfo[t].limitTimeInfo.minutes = o.data.pageItemInfo[t].limitTimeInfo.minutes < 10 ? "0" + o.data.pageItemInfo[t].limitTimeInfo.minutes : o.data.pageItemInfo[t].limitTimeInfo.minutes, 
                o.data.pageItemInfo[t].limitTimeInfo.seconds = o.data.pageItemInfo[t].limitTimeInfo.seconds < 10 ? "0" + o.data.pageItemInfo[t].limitTimeInfo.seconds : o.data.pageItemInfo[t].limitTimeInfo.seconds;
                o.data.pageItemInfo[t];
                var n = new Date(o.data.pageItemInfo[t].startTime), i = new Date(o.data.pageItemInfo[t].endTime);
                n.getFullYear() == i.getFullYear() && n.getMonth() + 1 == i.getMonth() + 1 && n.getDate() == i.getDate() ? o.data.pageItemInfo[t].limitTimeSameTime = !0 : o.data.pageItemInfo[t].limitTimeSameTime = !1;
            }
            o.setData({
                pageItemInfo: o.data.pageItemInfo,
                nowTime: e
            });
        }, 1e3), this.requestOcCartCount();
    },
    onHide: function() {
        clearInterval(this.data.intervarID);
    },
    onPullDownRefresh: function() {
        this.requestSpShopIndex(), this.requestSpShopIndexItem();
    },
    onPageScroll: function(e) {
        var t = e.scrollTop, a = 915 * this.data.systemInfo.screenWidth / 750 - 44;
        t < a && !this.data.navBarHidden ? this.setData({
            navBarHidden: !0
        }) : t > a && this.data.navBarHidden && this.setData({
            navBarHidden: !1
        }), t < this.data.systemInfo.screenHeight && !this.data.goTopButtonHidden ? this.setData({
            goTopButtonHidden: !0
        }) : t > this.data.systemInfo.screenHeight && this.data.goTopButtonHidden && this.setData({
            goTopButtonHidden: !1
        });
    },
    onShareAppMessage: function() {
        var e = this;
        return {
            title: e.data.headerInfo.spShop.sname + " × KKID",
            path: "/pages/user/login/login?spShopId=" + e.data.headerInfo.spShop.spShopId + "&ucUserId=" + e.data.userInfo.ucUserId,
            imageUrl: "../../../images/spu/home_share_pic.png"
        };
    },
    requestSpShopIndex: function() {
        var a = this;
        e.default.networkRequest(t.kscSpShopIndex, null, function(e) {
            wx.stopPullDownRefresh(), e.pdCategorys.push({
                name: "全部商品",
                picUrlAll: "../../../images/spu/home_category_all.png"
            }), a.setData({
                headerInfo: e
            });
        });
    },
    requestSpShopIndexItem: function() {
        var a = this;
        e.default.networkRequest(t.kscSpShopIndexItem2, null, function(e) {
            a.data.pageItemInfo = e;
            for (var t = Date.parse(new Date()), n = 0; n < a.data.pageItemInfo.length; n++) if (10 == a.data.pageItemInfo[n].type || 11 == a.data.pageItemInfo[n].type) {
                a.data.pageItemInfo[n].limitTimeInfo = {
                    hours: "",
                    minutes: "",
                    seconds: ""
                }, a.data.pageItemInfo[n].limitTimeSameTime = !1;
                var o = a.data.pageItemInfo[n].endTime - Date.parse(new Date());
                a.data.pageItemInfo[n].startTime > t ? o = a.data.pageItemInfo[n].startTime - t : a.data.pageItemInfo[n].endTime > t ? o = a.data.pageItemInfo[n].endTime - t : (o = 0, 
                a.requestSpShopIndexItem()), a.data.pageItemInfo[n].limitTimeInfo.hours = Math.floor(o / 1e3 / 60 / 60), 
                a.data.pageItemInfo[n].limitTimeInfo.minutes = Math.floor(o / 1e3 / 60 % 60), a.data.pageItemInfo[n].limitTimeInfo.seconds = Math.floor(o / 1e3 % 60), 
                a.data.pageItemInfo[n].limitTimeInfo.hours = a.data.pageItemInfo[n].limitTimeInfo.hours < 10 ? "0" + a.data.pageItemInfo[n].limitTimeInfo.hours : a.data.pageItemInfo[n].limitTimeInfo.hours, 
                a.data.pageItemInfo[n].limitTimeInfo.minutes = a.data.pageItemInfo[n].limitTimeInfo.minutes < 10 ? "0" + a.data.pageItemInfo[n].limitTimeInfo.minutes : a.data.pageItemInfo[n].limitTimeInfo.minutes, 
                a.data.pageItemInfo[n].limitTimeInfo.seconds = a.data.pageItemInfo[n].limitTimeInfo.seconds < 10 ? "0" + a.data.pageItemInfo[n].limitTimeInfo.seconds : a.data.pageItemInfo[n].limitTimeInfo.seconds;
                a.data.pageItemInfo[n];
                var i = new Date(a.data.pageItemInfo[n].startTime), s = new Date(a.data.pageItemInfo[n].endTime);
                i.getFullYear() == s.getFullYear() && i.getMonth() + 1 == s.getMonth() + 1 && i.getDate() == s.getDate() ? a.data.pageItemInfo[n].limitTimeSameTime = !0 : a.data.pageItemInfo[n].limitTimeSameTime = !1;
            }
            a.setData({
                pageItemInfo: a.data.pageItemInfo,
                nowTime: t
            });
        });
    },
    requestOcCartCount: function() {
        e.default.networkRequest(t.kscOcCartCount, null, function(e) {
            var t = e.itemCount;
            t > 0 ? (t = t > 99 ? "99+" : String(t), wx.setTabBarBadge({
                index: 2,
                text: t
            })) : wx.removeTabBarBadge({
                index: 2
            });
        });
    },
    goTopButtonMethod: function() {
        wx.pageScrollTo({
            scrollTop: 0
        });
    },
    addMineHiddenClose: function() {
        this.setData({
            addMineHidden: !0
        });
    },
    goLookAllSpu: function() {
        wx.navigateTo({
            url: "../../spu/spuSearchList/spuSearchList?searchAll=true"
        });
    },
    swiperChange: function(e) {
        this.setData({
            swiperCurrent: e.detail.current
        });
    },
    searchGoSpuSearchList: function() {
        wx.navigateTo({
            url: "../../spu/spuSearchList/spuSearchList?onlySearch=true"
        });
    },
    swiperBannerTap: function(e) {
        var t = this.data.headerInfo.spBanners[e.currentTarget.dataset.index].outId, a = this.data.headerInfo.spBanners[e.currentTarget.dataset.index].type;
        void 0 != t && "" != t && null != t && (10 == a ? wx.navigateTo({
            url: "../spuDetail/spuDetail?pdItemId=" + t
        }) : 12 == a ? wx.navigateTo({
            url: "../../spu/limitTimeList/limitTimeList?mkDiscountId=" + t
        }) : 13 == a && wx.navigateTo({
            url: "../../spu/activityTimeList/activityTimeList?mkDiscountId=" + t
        }));
    },
    goSpuSearchList: function(e) {
        var t = e.currentTarget.dataset.index;
        t != this.data.headerInfo.pdCategorys.length - 1 ? wx.navigateTo({
            url: "../../spu/spuSearchList/spuSearchList?spuPdCategory1Id=" + this.data.headerInfo.pdCategorys[t].pdCategoryId + "&title=" + this.data.headerInfo.pdCategorys[t].name
        }) : wx.navigateTo({
            url: "../../spu/spuSearchList/spuSearchList?searchAll=true"
        });
    },
    goSpuDetail: function(e) {
        wx.navigateTo({
            url: "../spuDetail/spuDetail?pdItemId=" + e.currentTarget.dataset.pditemid
        });
    },
    goRecommend: function() {
        wx.navigateTo({
            url: "../../user/recommend/recommend"
        });
    },
    buttonBack: function() {},
    ucSubscribeFavoriteButtonMethod: function(a) {
        var n = a.currentTarget.dataset.groupindex, o = a.currentTarget.dataset.index, i = this.data.pageItemInfo[n].pdItemList[o], s = this, d = {
            pdItemId: i.pdItemId
        };
        i.ucSubscribeFavorite ? e.default.networkRequest(t.kscUcSubscribeFavoriteDelete, d, function() {
            s.data.pageItemInfo[n].pdItemList[o].ucSubscribeFavorite = !1, s.setData({
                pageItemInfo: s.data.pageItemInfo
            });
        }) : e.default.networkRequest(t.kscUcSubscribeFavoriteSave, d, function() {
            s.data.pageItemInfo[n].pdItemList[o].ucSubscribeFavorite = !0, s.setData({
                pageItemInfo: s.data.pageItemInfo
            });
        });
    },
    getPhoneNumberSaleTap: function() {
        wx.requestSubscribeMessage({
            tmplIds: [ "nZbqzf5Rp_TpghGxCdGQJE5q283oweB6adpxBdQ7cqw" ]
        });
    },
    getPhoneNumberSale: function(a) {
        var n = a.currentTarget.dataset.groupindex, o = a.currentTarget.dataset.index, i = this;
        "getPhoneNumber:ok" === a.detail.errMsg && wx.login({
            success: function(s) {
                if (s.code) {
                    var d = {
                        encryptedData: a.detail.encryptedData,
                        iv: a.detail.iv,
                        code: s.code
                    };
                    e.default.networkRequest(t.kscUcUserWxBindmobile, d, function(e) {
                        wx.setStorage({
                            key: "userInfo",
                            data: e
                        }), i.setData({
                            userHaveMobile: !0
                        }), i.ucSubscribeSaleButtonMethod(!1, n, o);
                    });
                }
            }
        });
    },
    ucSubscribeSaleButtonMethod: function(a, n, o) {
        var i = void 0, s = void 0;
        0 == a ? (s = n, i = o) : (s = a.currentTarget.dataset.groupindex, i = a.currentTarget.dataset.index);
        var d = this.data.pageItemInfo[s].pdItemList[i], r = this, u = d.ucSubscribeSale, I = {
            pdItemId: d.pdItemId
        };
        u ? e.default.networkRequest(t.kscUcSubscribeSaleDelete, I, function() {
            r.data.pageItemInfo[s].pdItemList[i].ucSubscribeSale = !1, r.setData({
                pageItemInfo: r.data.pageItemInfo
            }), wx.showToast({
                title: "已取消开售提醒",
                icon: "none"
            });
        }) : (0 != a && wx.requestSubscribeMessage({
            tmplIds: [ "nZbqzf5Rp_TpghGxCdGQJE5q283oweB6adpxBdQ7cqw" ]
        }), e.default.networkRequest(t.kscUcSubscribeSaleSave, I, function() {
            r.data.pageItemInfo[s].pdItemList[i].ucSubscribeSale = !0, r.setData({
                pageItemInfo: r.data.pageItemInfo
            }), wx.showToast({
                title: "成功设置开售提醒，届时将短信通知你",
                icon: "none"
            });
        }));
    },
    getPhoneNumberStockTap: function() {
        wx.requestSubscribeMessage({
            tmplIds: [ "FzImEwPN_NLY-pqeYQiyqpwyUmCTzVVdrdn-BVUOBiM" ]
        });
    },
    getPhoneNumberStock: function(a) {
        var n = a.currentTarget.dataset.groupindex, o = a.currentTarget.dataset.index, i = this;
        "getPhoneNumber:ok" === a.detail.errMsg && wx.login({
            success: function(s) {
                if (s.code) {
                    var d = {
                        encryptedData: a.detail.encryptedData,
                        iv: a.detail.iv,
                        code: s.code
                    };
                    e.default.networkRequest(t.kscUcUserWxBindmobile, d, function(e) {
                        wx.setStorage({
                            key: "userInfo",
                            data: e
                        }), i.setData({
                            userHaveMobile: !0
                        }), i.ucSubscribeStockButtonMethod(!1, n, o);
                    });
                }
            }
        });
    },
    ucSubscribeStockButtonMethod: function(a, n, o) {
        var i = void 0, s = void 0;
        0 == a ? (s = n, i = o) : (s = a.currentTarget.dataset.groupindex, i = a.currentTarget.dataset.index);
        var d = this.data.pageItemInfo[s].pdItemList[i], r = this, u = d.ucSubscribeStock, I = {
            pdItemId: d.pdItemId
        };
        u ? e.default.networkRequest(t.kscUcSubscribeStockDelete, I, function() {
            r.data.pageItemInfo[s].pdItemList[i].ucSubscribeStock = !1, r.setData({
                pageItemInfo: r.data.pageItemInfo
            }), wx.showToast({
                title: "已取消开售提醒",
                icon: "none"
            });
        }) : (0 != a && wx.requestSubscribeMessage({
            tmplIds: [ "FzImEwPN_NLY-pqeYQiyqpwyUmCTzVVdrdn-BVUOBiM" ]
        }), e.default.networkRequest(t.kscUcSubscribeStockSave, I, function() {
            r.data.pageItemInfo[s].pdItemList[i].ucSubscribeStock = !0, r.setData({
                pageItemInfo: r.data.pageItemInfo
            }), wx.showToast({
                title: "成功设置开售提醒，届时将短信通知你",
                icon: "none"
            });
        }));
    },
    bindGetUserInfoBuy: function(e) {
        var t = this;
        "getUserInfo:ok" == e.detail.errMsg ? wx.login({
            success: function(a) {
                var n = {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    code: a.code
                };
                t.updateIconInfo(n), t.buyButtonMethod(e);
            },
            fail: function(a) {
                t.buyButtonMethod(e);
            }
        }) : this.buyButtonMethod(e);
    },
    updateIconInfo: function(a) {
        var n = this;
        e.default.networkRequest(t.kscUcUserWxLogin, a, function(e) {
            n.setData({
                userInfo: e
            }), wx.setStorage({
                key: "userInfo",
                data: e
            });
        });
    },
    buyButtonMethod: function(e) {
        var t = e.currentTarget.dataset.groupindex, a = e.currentTarget.dataset.index, n = this.data.pageItemInfo[t].pdItemList[a];
        wx.navigateTo({
            url: "../spuDetail/spuDetail?buyDirect=true&pdItemId=" + n.pdItemId
        });
    },
    goLimitTimeList: function(e) {
        var t = e.currentTarget.dataset.groupindex;
        wx.navigateTo({
            url: "../../spu/limitTimeList/limitTimeList?mkDiscountId=" + this.data.pageItemInfo[t].mkDiscountId
        });
    },
    goActivityTimeList: function(e) {
        var t = e.currentTarget.dataset.groupindex;
        this.data.pageItemInfo[t].spShopId > 0 ? wx.navigateTo({
            url: "../../spu/spuSearchList/spuSearchList?groupType=23"
        }) : wx.navigateTo({
            url: "../../spu/activityTimeList/activityTimeList?mkDiscountId=" + this.data.pageItemInfo[t].mkDiscountId
        });
    },
    autoUpdate: function() {
        var e = this;
        if (wx.canIUse("getUpdateManager")) {
            var t = wx.getUpdateManager();
            t.onCheckForUpdate(function(a) {
                a.hasUpdate && wx.showModal({
                    title: "更新提示",
                    content: "检测到新版本，是否下载新版本并重启小程序？",
                    success: function(a) {
                        a.confirm ? e.downLoadAndUpdate(t) : a.cancel && wx.showModal({
                            title: "温馨提示",
                            content: "本次版本更新涉及到新的功能添加，旧版本可能无法正常访问哦",
                            showCancel: !1,
                            confirmText: "确定更新",
                            success: function(a) {
                                a.confirm && e.downLoadAndUpdate(t);
                            }
                        });
                    }
                });
            });
        } else wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
    },
    downLoadAndUpdate: function(e) {
        wx.showLoading(), e.onUpdateReady(function() {
            wx.hideLoading(), e.applyUpdate();
        }), e.onUpdateFailed(function() {
            wx.showModal({
                title: "已经有新版本了哟",
                content: "新版本已经上线啦，请您删除当前小程序，重新搜索打开哟"
            });
        });
    }
});