var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), e = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        options: null,
        systemInfo: null,
        isIphoneX: !1,
        titleHiddenWhether: !1,
        goTopButtonHidden: !0,
        spuInfo: null,
        product: null,
        swiperCurrent: 0,
        spShopId: null,
        ucUserId: null,
        chooseValues: [],
        choosedSku: null,
        userHaveMobile: !1,
        buyNum: 1,
        shareSheetShow: !1,
        typeSheetShow: !1,
        sharePicCodeUrl: null,
        showShareImg: !1,
        shareSpuPicUrl: null,
        differTimesStr: "",
        explainDeliveryShow: !1,
        explainServiceShow: !1,
        shareCardUrl: null,
        shopInfo: null,
        cartNum: 0,
        isAddShow: !1,
        lookBigPicShow: !1,
        lookBigPicUrl: ""
    },
    onLoad: function(a) {
        var s = wx.getSystemInfoSync(), o = -1 != s.model.search("iPhone X"), i = this, n = wx.getStorageSync("userInfo"), d = !1;
        n ? (void 0 != n.mobile && null != n.mobile && n.mobile.length > 5 && (d = !0), 
        this.setData({
            options: a,
            systemInfo: s,
            isIphoneX: o,
            spShopId: n.ucUserShopinfo.customerShopId,
            ucUserId: n.ucUserId,
            userHaveMobile: d,
            userInfo: n
        }), i.pageAllRequest()) : wx.login({
            success: function(u) {
                var p = {
                    code: u.code
                };
                t.default.networkRequest(e.kscUcUserWxLogin, p, function(t) {
                    wx.setStorage({
                        key: "userInfo",
                        data: t
                    }), void 0 != (n = t).mobile && null != n.mobile && n.mobile.length > 5 && (d = !0), 
                    i.setData({
                        options: a,
                        systemInfo: s,
                        isIphoneX: o,
                        spShopId: n.ucUserShopinfo.customerShopId,
                        ucUserId: n.ucUserId,
                        userHaveMobile: d,
                        userInfo: n
                    }), i.pageAllRequest();
                });
            }
        });
    },
    pageAllRequest: function() {
        this.requestSpuInfo(), this.requestSpuForhwq(), this.requestOcCartCount(), this.autoUpdate();
        var t = this;
        this.data.intervarID = setInterval(function() {
            if (null != t.data.spuInfo && void 0 != t.data.spuInfo.mkDiscount) {
                var e = t.data.spuInfo.mkDiscount.endTime - Date.parse(new Date());
                if (e >= 0) {
                    var a = Math.floor(e / 1e3 / 60 / 60 / 24), s = Math.floor(e / 1e3 / 60 / 60 % 24), o = Math.floor(e / 1e3 / 60 % 60), i = Math.floor(e / 1e3 % 60);
                    i = i < 10 ? "0" + i : i, o = o < 10 ? "0" + o : o, s = s < 10 ? "0" + s : s, t.setData({
                        differTimesStr: a + "天" + s + "小时" + o + "分" + i + "秒"
                    });
                } else t.requestSpuInfo();
            }
        }, 1e3);
    },
    onUnload: function() {
        void 0 != this.data.intervarID && clearInterval(this.data.intervarID);
    },
    onPageScroll: function(t) {
        var e = t.scrollTop;
        e < this.data.systemInfo.screenWidth - this.data.systemInfo.statusBarHeight - 44 && this.data.titleHiddenWhether ? this.setData({
            titleHiddenWhether: !1
        }) : e > this.data.systemInfo.screenWidth - this.data.systemInfo.statusBarHeight - 44 && !this.data.titleHiddenWhether && this.setData({
            titleHiddenWhether: !0
        }), e < this.data.systemInfo.screenHeight && !this.data.goTopButtonHidden ? this.setData({
            goTopButtonHidden: !0
        }) : e > this.data.systemInfo.screenHeight && this.data.goTopButtonHidden && this.setData({
            goTopButtonHidden: !1
        });
    },
    onShareAppMessage: function() {
        return this.data.shareSheetShow && this.setData({
            shareSheetShow: !1
        }), null == this.data.shareCardUrl ? {
            title: this.data.spuInfo.pdItem.title,
            path: "/pages/user/login/login?pageType=6000&pdItemId=" + this.options.pdItemId + "&spShopId=" + this.data.spShopId + "&ucUserId=" + this.data.ucUserId,
            imageUrl: this.data.spuInfo.pdItem.pdSpu.picUrlAll
        } : {
            title: this.data.spuInfo.pdItem.title,
            path: "/pages/user/login/login?pageType=6000&pdItemId=" + this.options.pdItemId + "&spShopId=" + this.data.spShopId + "&ucUserId=" + this.data.ucUserId,
            imageUrl: this.data.shareCardUrl
        };
    },
    requestSpuInfo: function() {
        var a = this, s = {
            pdItemId: this.options.pdItemId
        };
        t.default.networkRequest(e.kscPdItemInfo, s, function(t) {
            var e = !1;
            a.data.options.buyDirect && (e = !0);
            var s = "a_" + a.data.options.pdItemId + "_" + a.data.spShopId + "_" + a.data.ucUserId, o = !1;
            a.data.options.shareSheetShow && (o = !0), a.setData({
                typeSheetShow: e,
                sharePicCodeUrl: "https://app.kkid.vip/kshop-appc/weixincode.htm?scene=" + encodeURIComponent(s) + "&width=250&isHyaline=true",
                shareSheetShow: o
            });
            for (var i = 0; i < t.itemPdTypes.length; i++) for (var n = 0; n < t.itemPdTypes[i].pdTypeValList.length; n++) t.itemPdTypes[i].pdTypeValList[n].style = (n + 1) % 3 == 1 ? "margin-left:0;margin-right:10rpx" : (n + 1) % 3 == 2 ? "margin-left:10rpx;margin-right:10rpx" : "margin-left:10rpx;margin-right:0";
            if (a.data.spuInfo = t, 0 == a.data.spuInfo.pdItem.pdSpu.skuStatus) a.data.choosedSku = a.data.spuInfo.pdItem.mainItemSku; else if (1 == a.data.spuInfo.pdItemSkus.length) for (var d = 0; d < a.data.spuInfo.itemPdTypes.length; d++) for (var u = 0; u < a.data.spuInfo.pdItemSkus[0].pdSku.pdSkuTypeValsMap.length; u++) if (a.data.spuInfo.itemPdTypes[d].pdTypeId == a.data.spuInfo.pdItemSkus[0].pdSku.pdSkuTypeValsMap[u].pdTypeId) {
                for (var p = a.data.spuInfo.pdItemSkus[0].pdSku.pdSkuTypeValsMap[u].pdTypeValId, l = void 0, r = 0; r < a.data.spuInfo.itemPdTypes[d].pdTypeValList.length; r++) if (a.data.spuInfo.itemPdTypes[d].pdTypeValList[r].pdTypeValId == p) {
                    l = a.data.spuInfo.itemPdTypes[d].pdTypeValList[r];
                    break;
                }
                a.data.spuInfo.itemPdTypes[d].choosedPdTypeVal = l;
                break;
            }
            a.handleTypeValueButtonMethod(), setTimeout(function() {
                a.createShareCardPic();
            }, 500);
        }), t.default.networkRequest(e.kscSpShopInfo, null, function(t) {
            a.setData({
                shopInfo: t
            });
        });
    },
    requestSpuForhwq: function() {
        var a = this, s = {
            pdItemId: this.options.pdItemId
        };
        t.default.networkRequest(e.kscPdItemForhwq, s, function(t) {
            a.setData({
                product: t.product
            });
        });
    },
    requestOcCartCount: function() {
        var a = this;
        t.default.networkRequest(e.kscOcCartCount, null, function(t) {
            var e = t.itemCount;
            e > 99 && (e = "99+"), a.setData({
                cartNum: e
            });
        });
    },
    backButtonMethod: function() {
        this.data.options.backFirst ? wx.switchTab({
            url: "../../spu/homePage/homePage"
        }) : wx.navigateBack();
    },
    goTopButtonMethod: function() {
        wx.pageScrollTo({
            scrollTop: 0
        });
    },
    longtapPicSave: function(t) {
        var e = this.data.spuInfo.pdItem.pdSpu.pdSpuPicList[t.currentTarget.dataset.index].picUrlAll + "?x-oss-process=image/resize,w_750";
        wx.downloadFile({
            url: e,
            success: function(t) {
                wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function(t) {
                        wx.showToast({
                            title: "已保存到手机相册",
                            icon: "none"
                        });
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "授权提示",
                            content: "保存商品图片到手机相册需要你的微信授权，请在设置中授权「相册」。",
                            confirmColor: "#5f7fdc",
                            success: function(t) {
                                t.confirm && wx.openSetting();
                            }
                        });
                    }
                });
            },
            fail: function(t) {
                wx.showToast({
                    title: "图片下载失败，请稍后重试",
                    icon: "none"
                });
            }
        });
    },
    swiperChange: function(t) {
        this.setData({
            swiperCurrent: t.detail.current
        });
    },
    commentLookMore: function() {
        wx.navigateTo({
            url: "../../order/commentLook/commentLook?pdSpuId=" + this.data.spuInfo.pdItem.pdSpuId
        });
    },
    handleTypeValueButtonMethod: function() {
        for (var t = 0; t < this.data.spuInfo.itemPdTypes.length; t++) for (var e = 0; e < this.data.spuInfo.itemPdTypes[t].pdTypeValList.length; e++) {
            var a = this.data.spuInfo.itemPdTypes[t].pdTypeValList[e];
            this.isChoosedValueWhether(a) ? this.data.spuInfo.itemPdTypes[t].pdTypeValList[e].displayStatus = "selected" : this.isCanChoosedValueWhether(a) ? this.data.spuInfo.itemPdTypes[t].pdTypeValList[e].displayStatus = "normal" : this.data.spuInfo.itemPdTypes[t].pdTypeValList[e].displayStatus = "disabled";
        }
        for (var s = 0; s < this.data.spuInfo.pdItemSkus.length; s++) {
            for (var o = 0, i = this.data.spuInfo.pdItemSkus[s], n = 0; n < i.pdSku.pdSkuTypeValsMap.length; n++) for (var d = 0; d < this.data.spuInfo.itemPdTypes.length; d++) null == this.data.spuInfo.itemPdTypes[d].choosedPdTypeVal || void 0 == this.data.spuInfo.itemPdTypes[d].choosedPdTypeVal ? (this.data.choosedSku = null, 
            s = this.data.spuInfo.pdItemSkus.length, n = i.pdSku.pdSkuTypeValsMap.length, d = this.data.spuInfo.itemPdTypes.length) : i.pdSku.pdSkuTypeValsMap[n].pdTypeId == this.data.spuInfo.itemPdTypes[d].choosedPdTypeVal.pdTypeId && i.pdSku.pdSkuTypeValsMap[n].pdTypeValId != this.data.spuInfo.itemPdTypes[d].choosedPdTypeVal.pdTypeValId ? (this.data.choosedSku = null, 
            n = i.pdSku.pdSkuTypeValsMap.length, d = this.data.spuInfo.itemPdTypes.length) : i.pdSku.pdSkuTypeValsMap[n].pdTypeId == this.data.spuInfo.itemPdTypes[d].choosedPdTypeVal.pdTypeId && i.pdSku.pdSkuTypeValsMap[n].pdTypeValId == this.data.spuInfo.itemPdTypes[d].choosedPdTypeVal.pdTypeValId && (this.data.choosedSku = null, 
            o++);
            o == this.data.spuInfo.itemPdTypes.length && (this.data.choosedSku = this.data.spuInfo.pdItemSkus[s], 
            this.data.buyNum > this.data.choosedSku.qtySaleAvailable && (this.data.buyNum = this.data.choosedSku.qtySaleAvailable), 
            s = this.data.spuInfo.pdItemSkus.length);
        }
        this.setData({
            spuInfo: this.data.spuInfo,
            buyNum: this.data.buyNum,
            choosedSku: this.data.choosedSku
        });
    },
    isChoosedValueWhether: function(t) {
        for (var e = 0; e < this.data.spuInfo.itemPdTypes.length; e++) if (null != this.data.spuInfo.itemPdTypes[e].choosedPdTypeVal && this.data.spuInfo.itemPdTypes[e].choosedPdTypeVal.pdTypeValId == t.pdTypeValId) return !0;
        return !1;
    },
    isCanChoosedValueWhether: function(t) {
        for (var e = this.data.spuInfo.pdItemSkus, a = 0; a < e.length; a++) if (e[a].qtySaleAvailable > 0) {
            for (var s = 0, o = 0; o < e[a].pdSku.pdSkuTypeValsMap.length; o++) for (var i = 0; i < this.data.spuInfo.itemPdTypes.length; i++) null != this.data.spuInfo.itemPdTypes[i].choosedPdTypeVal && void 0 != this.data.spuInfo.itemPdTypes[i].choosedPdTypeVal ? this.data.spuInfo.itemPdTypes[i].choosedPdTypeVal.pdTypeId == t.pdTypeId ? e[a].pdSku.pdSkuTypeValsMap[o].pdTypeValId == t.pdTypeValId && s++ : e[a].pdSku.pdSkuTypeValsMap[o].pdTypeValId == this.data.spuInfo.itemPdTypes[i].choosedPdTypeVal.pdTypeValId && s++ : null != this.data.spuInfo.itemPdTypes[i].choosedPdTypeVal && void 0 != this.data.spuInfo.itemPdTypes[i].choosedPdTypeVal || e[a].pdSku.pdSkuTypeValsMap[o].pdTypeValId == t.pdTypeValId && s++;
            if (s == this.data.spuInfo.itemPdTypes.length) return !0;
        }
        return !1;
    },
    valueButtonMethod: function(t) {
        var e = t.currentTarget.dataset.pdtypeval, a = parseInt(t.currentTarget.dataset.index);
        "normal" == e.displayStatus ? (this.data.spuInfo.itemPdTypes[a].choosedPdTypeVal = e, 
        this.handleTypeValueButtonMethod()) : "selected" == e.displayStatus && (this.data.spuInfo.itemPdTypes[a].choosedPdTypeVal = null, 
        this.handleTypeValueButtonMethod());
    },
    bindGetUserInfoShare: function(t) {
        var e = this;
        "getUserInfo:ok" == t.detail.errMsg ? wx.login({
            success: function(a) {
                var s = {
                    encryptedData: t.detail.encryptedData,
                    iv: t.detail.iv,
                    code: a.code
                };
                e.updateIconInfo(s), e.shareButtonMethod();
            },
            fail: function(t) {
                e.shareButtonMethod();
            }
        }) : this.shareButtonMethod();
    },
    updateIconInfo: function(a) {
        var s = this;
        t.default.networkRequest(e.kscUcUserWxLogin, a, function(t) {
            s.setData({
                userInfo: t
            }), wx.setStorage({
                key: "userInfo",
                data: t
            });
        });
    },
    shareButtonMethod: function() {
        this.setData({
            shareSheetShow: !0
        });
    },
    shareSheetShowHandle: function() {
        this.setData({
            shareSheetShow: !1
        });
    },
    getSharePic: function() {
        this.setData({
            shareSheetShow: !1
        }), null == this.data.shareSpuPicUrl ? this.createSharePic() : this.setData({
            showShareImg: !0
        });
    },
    hideShareImg: function() {
        this.setData({
            showShareImg: !1
        });
    },
    createSharePic: function() {
        wx.showLoading({
            title: "正在生成海报..."
        });
        var t = this, e = new Promise(function(e, a) {
            wx.getImageInfo({
                src: t.data.spuInfo.pdItem.pdSpu.picUrlAll + "?x-oss-process=image/resize,w_750",
                success: function(t) {
                    e(t);
                }
            });
        }), a = new Promise(function(t, e) {
            wx.getImageInfo({
                src: "../../../images/spu/shareSpuPicBack.png",
                success: function(e) {
                    t(e);
                }
            });
        }), s = new Promise(function(e, a) {
            wx.getImageInfo({
                src: t.data.sharePicCodeUrl,
                success: function(t) {
                    e(t);
                }
            });
        });
        Promise.all([ e, a, s ]).then(function(e) {
            var a = wx.createCanvasContext("shareSpuImg");
            a.drawImage(e[0].path, 57, 181, 636, 636), a.drawImage("../../../" + e[1].path, 0, 0, 750, 1334), 
            a.drawImage(e[2].path, 537, 1e3, 166, 166), a.save(), a.setTextAlign("left"), a.setFillStyle("#363737"), 
            a.setFontSize(36), a.setTextBaseline("top");
            var s = "#" + t.data.spuInfo.pdItem.pdItemInfo.subtitle + "#";
            s.length > 18 && (s = s.substring(0, 18) + "..."), a.fillText(s, 58, 855.5, 634), 
            a.fillText(s, 58.5, 855, 634), a.fillText(s, 58, 855, 634), a.fillText(s, 58, 854.5, 634), 
            a.fillText(s, 57.5, 855, 634), a.save(), s = t.data.spuInfo.pdItem.pdSpu.pdBrand.name + " | " + t.data.spuInfo.pdItem.title, 
            a.setFontSize(24), s.length < 32 ? a.fillText(s, 58, 915, 634) : (a.fillText(s.substring(0, 32), 58, 915, 634), 
            s.length < 64 ? a.fillText(s.substring(32), 58, 948, 634) : a.fillText(s.substring(32, 64) + "...", 58, 948, 634)), 
            a.setFontSize(22), a.setFillStyle("#5F7FDC");
            var o = 164;
            if (23 == t.data.spuInfo.pdItem.groupType) a.fillText("门店现货", 58, 1002, 100); else {
                var i = void 0;
                i = 10 == t.data.spuInfo.pdItem.pdSpu.type ? "品牌直发" : "跨境保税", a.fillText(i, 58, 1002, 100), 
                a.setStrokeStyle("#B2B2B2"), a.moveTo(164, 1002), a.lineTo(164, 1024), a.fillText("全国包邮", 180, 1002, 100), 
                o = 288;
            }
            t.data.spuInfo.pdItem.textTags.length > 0 && (a.setStrokeStyle("#B2B2B2"), a.moveTo(o, 1002), 
            a.lineTo(o, 1024), a.setFillStyle("#E84B57"), a.fillText(t.data.spuInfo.pdItem.textTags[0], o + 16, 1002, 150)), 
            a.setFillStyle("#5F7FDC"), a.setFontSize(58);
            var n = t.data.spuInfo.pdItem.discountRetailPriceMin.toFixed(2).toString();
            if (a.fillText(n, 82.5, 1073, 250), a.fillText(n, 82, 1073.5, 250), a.fillText(n, 82, 1073, 250), 
            a.fillText(n, 81.5, 1073, 250), a.fillText(n, 82, 1072.5, 250), a.save(), t.data.spuInfo.pdItem.discountExistNow) {
                a.setFillStyle("#B2B2B2"), a.setFontSize(30);
                var d = 35 * n.length - 12 + 82, u = "￥" + t.data.spuInfo.pdItem.retailPriceMin.toFixed(2).toString();
                a.fillText(u, d, 1097, 228), a.setStrokeStyle("#B2B2B2"), a.moveTo(d, 1113), a.lineTo(d + 18 * u.length, 1113), 
                a.moveTo(d, 1113.5), a.lineTo(d + 18 * u.length, 1113.5);
            }
            a.setFillStyle("#B2B2B2"), a.setFontSize(22);
            var p = t.data.shopInfo.spShop.name;
            void 0 != t.data.spuInfo.spShopConsultant && (p = p + " | " + t.data.spuInfo.spShopConsultant.name), 
            a.fillText(p, 58, 1190, 400), a.stroke(), a.draw(), setTimeout(function() {
                t.canvasToTempFile();
            }, 2e3);
        });
    },
    canvasToTempFile: function() {
        var t = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 750,
            height: 1334,
            destWidth: 750,
            destHeight: 1334,
            canvasId: "shareSpuImg",
            success: function(e) {
                wx.hideLoading(), t.setData({
                    shareSpuPicUrl: e.tempFilePath,
                    showShareImg: !0
                });
            },
            fail: function(t) {
                wx.hideLoading(), wx.showToast({
                    title: "海报生成失败，请重试",
                    icon: "none"
                });
            }
        });
    },
    saveImageToPhoto: function() {
        var t = this;
        wx.saveImageToPhotosAlbum({
            filePath: t.data.shareSpuPicUrl,
            success: function(e) {
                wx.showToast({
                    title: "已保存到手机相册，赶快去分享吧~",
                    icon: "none"
                }), t.setData({
                    showShareImg: !0
                });
            },
            fail: function(t) {
                wx.showModal({
                    title: "授权提示",
                    content: "保存海报到手机相册需要你的微信授权，请在设置中授权「相册」。",
                    confirmColor: "#5f7fdc",
                    success: function(t) {
                        t.confirm && wx.openSetting();
                    }
                });
            }
        });
    },
    drawText: function(t) {
        this.ctx.save(), this.ctx.setFillStyle(t.color), this.ctx.setFontSize(t.size), this.ctx.setTextAlign(t.align), 
        this.ctx.setTextBaseline(t.baseline), t.bold && (this.ctx.fillText(t.text, t.x, t.y - .5), 
        this.ctx.fillText(t.text, t.x - .5, t.y), this.ctx.fillText(t.text, t.x, t.y + .5), 
        this.ctx.fillText(t.text, t.x + .5, t.y)), this.ctx.fillText(t.text, t.x, t.y), 
        this.ctx.restore();
    },
    textWrap: function(t) {
        for (var e = Math.ceil(t.width / t.size), a = Math.ceil(t.text.length / e), s = 0; s < a; s++) {
            var o = {
                x: t.x,
                y: t.y + s * t.height,
                color: t.color,
                size: t.size,
                align: t.align,
                baseline: t.baseline,
                text: t.text.substring(s * e, (s + 1) * e),
                bold: t.bold
            };
            s < t.line && (s == t.line - 1 && (o.text = o.text.substring(0, o.text.length - 3) + "......"), 
            this.drawText(o));
        }
    },
    recommendInfoCopyMethod: function() {
        var t = this;
        wx.setClipboardData({
            data: t.data.spuInfo.pdItem.pdItemInfo.description,
            success: function(t) {
                wx.showToast({
                    title: "文案复制成功",
                    icon: "none"
                });
            }
        });
    },
    favouriteButtonMethod: function() {
        var a = this, s = {
            pdItemId: this.options.pdItemId
        };
        this.data.spuInfo.pdItem.ucSubscribeFavorite ? t.default.networkRequest(e.kscUcSubscribeFavoriteDelete, s, function(t) {
            var e = a.data.spuInfo;
            e.pdItem.ucSubscribeFavorite = !1, a.setData({
                spuInfo: e
            });
        }) : t.default.networkRequest(e.kscUcSubscribeFavoriteSave, s, function(t) {
            var e = a.data.spuInfo;
            e.pdItem.ucSubscribeFavorite = !0, a.setData({
                spuInfo: e
            });
        });
    },
    goCartPage: function() {
        wx.switchTab({
            url: "../../order/cartPage/cartPage"
        });
    },
    getPhoneNumberSaleTap: function() {
        wx.requestSubscribeMessage({
            tmplIds: [ "nZbqzf5Rp_TpghGxCdGQJE5q283oweB6adpxBdQ7cqw" ]
        });
    },
    getPhoneNumberSale: function(a) {
        var s = this;
        "getPhoneNumber:ok" === a.detail.errMsg && wx.login({
            success: function(o) {
                if (o.code) {
                    var i = {
                        encryptedData: a.detail.encryptedData,
                        iv: a.detail.iv,
                        code: o.code
                    };
                    t.default.networkRequest(e.kscUcUserWxBindmobile, i, function(t) {
                        wx.setStorage({
                            key: "userInfo",
                            data: t
                        }), s.setData({
                            userHaveMobile: !0
                        }), s.ucSubscribeSaleButtonMethod(!1);
                    });
                }
            }
        });
    },
    ucSubscribeSaleButtonMethod: function(a) {
        var s = this, o = this.data.spuInfo.pdItem.ucSubscribeSale, i = {
            pdItemId: this.options.pdItemId
        };
        o ? t.default.networkRequest(e.kscUcSubscribeSaleDelete, i, function() {
            s.data.spuInfo.pdItem.ucSubscribeSale = !1, s.setData({
                spuInfo: s.data.spuInfo
            }), wx.showToast({
                title: "已取消开售提醒",
                icon: "none"
            });
        }) : (0 != a && wx.requestSubscribeMessage({
            tmplIds: [ "nZbqzf5Rp_TpghGxCdGQJE5q283oweB6adpxBdQ7cqw" ]
        }), t.default.networkRequest(e.kscUcSubscribeSaleSave, i, function() {
            s.data.spuInfo.pdItem.ucSubscribeSale = !0, s.setData({
                spuInfo: s.data.spuInfo
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
        var s = this;
        "getPhoneNumber:ok" === a.detail.errMsg && wx.login({
            success: function(o) {
                if (o.code) {
                    var i = {
                        encryptedData: a.detail.encryptedData,
                        iv: a.detail.iv,
                        code: o.code
                    };
                    t.default.networkRequest(e.kscUcUserWxBindmobile, i, function(t) {
                        wx.setStorage({
                            key: "userInfo",
                            data: t
                        }), s.setData({
                            userHaveMobile: !0
                        }), s.ucSubscribeStockButtonMethod(!1);
                    });
                }
            }
        });
    },
    ucSubscribeStockButtonMethod: function(a) {
        var s = this, o = this.data.spuInfo.pdItem.ucSubscribeStock, i = {
            pdItemId: this.options.pdItemId
        };
        o ? t.default.networkRequest(e.kscUcSubscribeStockDelete, i, function() {
            s.data.spuInfo.pdItem.ucSubscribeStock = !1, s.setData({
                spuInfo: s.data.spuInfo
            }), wx.showToast({
                title: "已取消到货提醒",
                icon: "none"
            });
        }) : (0 != a && wx.requestSubscribeMessage({
            tmplIds: [ "FzImEwPN_NLY-pqeYQiyqpwyUmCTzVVdrdn-BVUOBiM" ]
        }), t.default.networkRequest(e.kscUcSubscribeStockSave, i, function() {
            s.data.spuInfo.pdItem.ucSubscribeStock = !0, s.setData({
                spuInfo: s.data.spuInfo
            }), wx.showToast({
                title: "成功设置到货提醒，届时将短信通知你",
                icon: "none"
            });
        }));
    },
    bindGetUserInfoNowBuy: function(t) {
        var e = this;
        t.currentTarget.dataset.isaddshow ? this.data.isAddShow = !0 : this.data.isAddShow = !1;
        "getUserInfo:ok" == t.detail.errMsg ? wx.login({
            success: function(a) {
                var s = {
                    encryptedData: t.detail.encryptedData,
                    iv: t.detail.iv,
                    code: a.code
                };
                e.updateIconInfo(s), e.butItNowButtonMethod(t);
            },
            fail: function(a) {
                e.butItNowButtonMethod(t);
            }
        }) : this.butItNowButtonMethod(t);
    },
    butItNowButtonMethod: function(t) {
        t.currentTarget.dataset.isaddshow ? this.data.isAddShow = !0 : this.data.isAddShow = !1, 
        this.setData({
            buyNum: 1,
            typeSheetShow: !0
        });
    },
    typeSheetShowHandle: function() {
        this.setData({
            typeSheetShow: !1
        });
    },
    explainDeliveryShowHandle: function() {
        this.setData({
            explainDeliveryShow: !this.data.explainDeliveryShow
        });
    },
    explainServiceShowHandle: function() {
        this.setData({
            explainServiceShow: !this.data.explainServiceShow
        });
    },
    buyNumJian: function() {
        1 != this.data.buyNum && this.setData({
            buyNum: this.data.buyNum - 1
        });
    },
    buyNumJia: function() {
        99 == this.data.buyNum || null != this.data.choosedSku && this.data.choosedSku.qtySaleAvailable == this.data.buyNum || this.setData({
            buyNum: this.data.buyNum + 1
        });
    },
    butItNowCardButtonMethod: function() {
        var a = void 0;
        if (0 == this.data.spuInfo.pdItem.pdSpu.skuStatus) a = this.data.spuInfo.pdItem.mainItemSku; else {
            if (null == this.data.choosedSku) {
                for (var s = 0; s < this.data.spuInfo.itemPdTypes.length; s++) if (null == this.data.spuInfo.itemPdTypes[s].choosedPdTypeVal || void 0 == this.data.spuInfo.itemPdTypes[s].choosedPdTypeVal) {
                    var o = "请选择" + this.data.spuInfo.itemPdTypes[s].name;
                    return void wx.showToast({
                        title: o,
                        icon: "none"
                    });
                }
                return;
            }
            a = this.data.choosedSku;
        }
        if (this.data.isAddShow) {
            var i = this, n = {
                pdItemId: this.options.pdItemId,
                pdItemSkuId: a.pdItemSkuId,
                delta: this.data.buyNum
            };
            t.default.networkRequest(e.kscOcCartChange, n, function(t) {
                i.setData({
                    typeSheetShow: !1
                }), i.requestOcCartCount(), wx.showToast({
                    title: "成功加入购物车",
                    icon: "none"
                });
            });
        } else {
            var d = {
                ocCarts: [ {
                    pdItem: {
                        pdItemId: this.options.pdItemId
                    },
                    pdItemSku: {
                        pdItemSkuId: a.pdItemSkuId
                    },
                    qty: this.data.buyNum
                } ]
            };
            wx.navigateTo({
                url: "../../order/orderConfirm/orderConfirm?needInfo=" + JSON.stringify(d)
            }), this.typeSheetShowHandle();
        }
    },
    createShareCardPic: function() {
        var t = this, e = new Promise(function(e, a) {
            wx.getImageInfo({
                src: t.data.spuInfo.pdItem.pdSpu.picUrlAll + "?x-oss-process=image/resize,w_750",
                success: function(t) {
                    e(t);
                }
            });
        }), a = new Promise(function(t, e) {
            wx.getImageInfo({
                src: "../../../images/spu/item_share_card_back.png",
                success: function(e) {
                    t(e);
                }
            });
        });
        Promise.all([ e, a ]).then(function(e) {
            var a = wx.createCanvasContext("shareCardImg");
            a.drawImage(e[0].path, 45, 120, 310, 310), a.drawImage("../../../" + e[1].path, 0, 0, 648, 519), 
            a.setTextAlign("left"), a.setFillStyle("#363737"), a.setFontSize(36), a.setTextBaseline("top");
            var s = "#" + t.data.spuInfo.pdItem.pdItemInfo.subtitle + "#";
            s.length > 16 && (s = s.substring(0, 16) + "..."), a.fillText(s, 45, 44.5, 558), 
            a.fillText(s, 45.5, 45, 558), a.fillText(s, 45, 45, 558), a.fillText(s, 45, 44.5, 558), 
            a.fillText(s, 44.5, 45, 558), a.save();
            var o = t.data.spuInfo.pdItem.discountRetailPriceMin.toFixed(2).toString();
            if (a.setFillStyle("#5f7fdc"), a.setFontSize(51), a.fillText(o, 408.5, 130, 200), 
            a.fillText(o, 408, 130.5, 200), a.fillText(o, 408, 130, 200), a.fillText(o, 407.5, 130, 200), 
            a.fillText(o, 408, 129.5, 200), void 0 == t.data.spuInfo.mkDiscount) {
                var i = "全国包邮";
                23 == t.data.spuInfo.pdItem.groupType && (i = "门店现货"), a.setFontSize(33), a.fillText(i, 380, 195, 228);
            } else {
                var n = "￥" + t.data.spuInfo.pdItem.retailPriceMin.toFixed(2).toString();
                a.setFillStyle("#B2B2B2"), a.setFontSize(27), a.fillText(n, 380.5, 188, 228), a.fillText(n, 380, 188.5, 228), 
                a.fillText(n, 380, 188, 228), a.fillText(n, 379.5, 188, 228), a.fillText(n, 380, 187.5, 380), 
                a.setStrokeStyle("#B2B2B2"), a.moveTo(380, 201.5), a.lineTo(380 + 15 * n.length, 201.5), 
                a.moveTo(380, 202), a.lineTo(380 + 15 * n.length, 202), a.moveTo(380, 202.5), a.lineTo(380 + 15 * n.length, 202.5), 
                a.setFontSize(33), a.setFillStyle("#5f7fdc");
                var d = "全国包邮";
                23 == t.data.spuInfo.pdItem.groupType && (d = "门店现货"), t.data.spuInfo.pdItem.textTags.length > 0 && (a.setFillStyle("#E84B57"), 
                d = t.data.spuInfo.pdItem.textTags[0]), a.fillText(d, 380, 230, 380);
            }
            a.stroke(), a.draw(), setTimeout(function() {
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 648,
                    height: 519,
                    destWidth: 648,
                    destHeight: 519,
                    canvasId: "shareCardImg",
                    success: function(e) {
                        t.setData({
                            shareCardUrl: e.tempFilePath
                        });
                    }
                });
            }, 2e3);
        });
    },
    lookBigPic: function(t) {
        this.setData({
            lookBigPicShow: !0,
            lookBigPicUrl: t.currentTarget.dataset.url
        });
    },
    lookBigPicClose: function() {
        this.setData({
            lookBigPicShow: !1,
            lookBigPicUrl: ""
        });
    },
    autoUpdate: function() {
        var t = this;
        if (wx.canIUse("getUpdateManager")) {
            var e = wx.getUpdateManager();
            e.onCheckForUpdate(function(a) {
                a.hasUpdate && wx.showModal({
                    title: "更新提示",
                    content: "检测到新版本，是否下载新版本并重启小程序？",
                    success: function(a) {
                        a.confirm ? t.downLoadAndUpdate(e) : a.cancel && wx.showModal({
                            title: "温馨提示",
                            content: "本次版本更新涉及到新的功能添加，旧版本可能无法正常访问哦",
                            showCancel: !1,
                            confirmText: "确定更新",
                            success: function(a) {
                                a.confirm && t.downLoadAndUpdate(e);
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
    downLoadAndUpdate: function(t) {
        wx.showLoading(), t.onUpdateReady(function() {
            wx.hideLoading(), t.applyUpdate();
        }), t.onUpdateFailed(function() {
            wx.showModal({
                title: "已经有新版本了哟",
                content: "新版本已经上线啦，请您删除当前小程序，重新搜索打开哟"
            });
        });
    }
});