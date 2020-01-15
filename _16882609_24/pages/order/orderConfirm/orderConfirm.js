var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), t = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        systemInfo: wx.getSystemInfoSync(),
        options: null,
        nowtimestamp: 0,
        pageInfo: null,
        expectDeliveryType: 10,
        payType: 10,
        outPayNo: "",
        orderInfo: null,
        recertification: !1,
        addressChange: !1,
        orderAgainPayShow: !1,
        userHaveMobile: !1
    },
    onLoad: function(o) {
        wx.hideShareMenu();
        var a = this, r = !1, n = wx.getStorageSync("userInfo");
        if (n ? (void 0 != n.mobile && null != n.mobile && n.mobile.length > 5 && (r = !0), 
        this.setData({
            userHaveMobile: r
        })) : wx.login({
            success: function(o) {
                var i = {
                    code: o.code
                };
                e.default.networkRequest(t.kscUcUserWxLogin, i, function(e) {
                    wx.setStorage({
                        key: "userInfo",
                        data: e
                    }), void 0 != (n = e).mobile && null != n.mobile && n.mobile.length > 5 && (r = !0), 
                    a.setData({
                        userHaveMobile: r
                    });
                });
            }
        }), this.data.intervarID = setInterval(function() {
            if (null != a.data.orderInfo) {
                var e = Date.parse(new Date());
                a.data.orderInfo.payTimeET < e ? a.setData({
                    nowtimestamp: a.data.orderInfo.payTimeET
                }) : a.setData({
                    nowtimestamp: e
                });
            }
        }, 1e3), o.isBack) {
            var i = wx.getStorageSync("orderConfirmInfo");
            wx.removeStorage({
                key: "orderConfirmInfo",
                success: function(e) {}
            }), this.setData(i);
        } else {
            var d = this, s = JSON.parse(o.needInfo);
            e.default.networkRequest(t.kscOcOrderPresave2, s, function(e) {
                var t = "", o = 10;
                23 == e.ocOrder.groupType && 1 == e.prePayWithShop && void 0 != e.ocOrder.bsPay.outPayNo && (t = e.ocOrder.bsPay.outPayNo, 
                o = e.ocOrder.bsPay.payType), d.setData({
                    options: s,
                    pageInfo: e,
                    outPayNo: t,
                    payType: o
                });
            });
        }
    },
    onUnload: function() {
        if (null != this.data.orderInfo) {
            var e = this;
            wx.showModal({
                title: "确定要放弃付款吗？",
                content: "你尚未完成支付，喜欢的商品可能会被抢空哦~",
                cancelText: "放弃",
                cancelColor: "#B2B2B2",
                confirmText: "继续支付",
                confirmColor: "#5f7fdc",
                success: function(t) {
                    t.confirm ? (wx.setStorageSync("orderConfirmInfo", e.data), wx.navigateTo({
                        url: "../../order/orderConfirm/orderConfirm?isBack=true"
                    })) : t.cancel && e.setData({
                        orderInfo: null
                    });
                }
            });
        }
        clearInterval(this.data.intervarID);
    },
    backButtonMethod: function() {
        if (null != this.data.orderInfo) {
            var e = this;
            wx.showModal({
                title: "确定要放弃付款吗？",
                content: "你尚未完成支付，喜欢的商品可能会被抢空哦~",
                cancelText: "放弃",
                cancelColor: "#B2B2B2",
                confirmText: "继续支付",
                confirmColor: "#5f7fdc",
                success: function(t) {
                    t.cancel && (e.setData({
                        orderInfo: null
                    }), wx.navigateBack());
                }
            });
        } else wx.navigateBack();
    },
    handleExpectDeliveryType: function(e) {
        null == this.data.orderInfo ? this.setData({
            expectDeliveryType: e.currentTarget.dataset.type
        }) : wx.showToast({
            title: "订单已提交，无法修改配送方式了喔~",
            icon: "none"
        });
    },
    phoneCall: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.pageInfo.ocOrder.spShop.contactTel
        });
    },
    addressInfoChoose: function() {
        var e = this;
        wx.getSetting({
            success: function(t) {
                0 == t.authSetting["scope.address"] ? wx.showModal({
                    title: "授权提示",
                    content: "一键获取微信地址需要你的微信授权，请在设置中授权「通讯地址」。",
                    confirmColor: "#5f7fdc",
                    success: function(e) {
                        e.confirm && wx.openSetting();
                    }
                }) : wx.chooseAddress({
                    success: function(t) {
                        e.chooseAddressHandle(t);
                    }
                });
            }
        });
    },
    chooseAddressHandle: function(o) {
        this.data.pageInfo.ocOrder.ocOrderInfo.provinceName = o.provinceName, this.data.pageInfo.ocOrder.ocOrderInfo.cityName = o.cityName, 
        this.data.pageInfo.ocOrder.ocOrderInfo.areaName = o.countyName, this.data.pageInfo.ocOrder.ocOrderInfo.address = o.detailInfo, 
        this.data.pageInfo.ocOrder.ocOrderInfo.name = o.userName, this.data.pageInfo.ocOrder.ocOrderInfo.mobile = o.telNumber, 
        this.setData({
            pageInfo: this.data.pageInfo,
            addressChange: !0
        }), e.default.networkRequest(t.kscUcAddressDefaultSave, {
            ucAddress: this.data.pageInfo.ocOrder.ocOrderInfo
        }, function(e) {});
    },
    goIdCertificationPage: function() {
        wx.navigateTo({
            url: "../idCertification/idCertification"
        });
    },
    payTypeHandle: function(e) {
        null == this.data.orderInfo ? this.setData({
            payType: e.currentTarget.dataset.paytype
        }) : wx.showToast({
            title: "订单已提交，无法修改支付方式了喔~",
            icon: "none"
        });
    },
    outPayNoInput: function(e) {
        this.data.outPayNo = e.detail.value;
    },
    getPhoneNumberSaleSubmit: function(o) {
        var a = this;
        "getPhoneNumber:ok" === o.detail.errMsg && wx.login({
            success: function(r) {
                if (r.code) {
                    var n = {
                        encryptedData: o.detail.encryptedData,
                        iv: o.detail.iv,
                        code: r.code
                    };
                    e.default.networkRequest(t.kscUcUserWxBindmobile, n, function(e) {
                        wx.setStorage({
                            key: "userInfo",
                            data: e
                        }), a.setData({
                            userHaveMobile: !0
                        }), a.submitButtonMethod(!1);
                    });
                }
            }
        });
    },
    submitButtonMethod: function(e) {
        if (null == this.data.orderInfo) {
            var t = {
                ocCarts: this.data.options.ocCarts
            };
            if (t.expectDeliveryType = this.data.expectDeliveryType, 10 == this.data.expectDeliveryType) {
                if (void 0 == this.data.pageInfo.ocOrder.ocOrderInfo.cityName || null == this.data.pageInfo.ocOrder.ocOrderInfo.cityName || 0 == this.data.pageInfo.ocOrder.ocOrderInfo.cityName.length) return void wx.showToast({
                    title: "你还没有设置收货地址",
                    icon: "none"
                });
                t.ocOrderInfo = this.data.pageInfo.ocOrder.ocOrderInfo;
            }
            if (20 != this.data.pageInfo.ocOrder.type || void 0 != this.data.pageInfo.ocOrder.ocOrderInfo.idNoEncryption && null != this.data.pageInfo.ocOrder.ocOrderInfo.idNoEncryption && 0 != this.data.pageInfo.ocOrder.ocOrderInfo.idNoEncryption.length) if (t.payType = this.data.payType, 
            72 == t.payType && (t.outPayNo = this.data.outPayNo), 72 == this.data.payType && this.data.outPayNo.length < 6) wx.showToast({
                title: "请正确填写充值卡卡号",
                icon: "none"
            }); else {
                var o = this;
                0 != e ? 23 == this.data.pageInfo.ocOrder.groupType ? wx.requestSubscribeMessage({
                    tmplIds: [ "OG56_L2S6LS9D9wfy0b_yjAjGGgdvoOdSK68dMfhPcc" ],
                    complete: function() {
                        o.createOrder(t);
                    }
                }) : wx.requestSubscribeMessage({
                    tmplIds: [ "OG56_L2S6LS9D9wfy0b_yl3aBz3VmfbM4c1oRNg-9GQ" ],
                    complete: function() {
                        o.createOrder(t);
                    }
                }) : o.createOrder(t);
            } else wx.showToast({
                title: "你还没有实名认证",
                icon: "none"
            });
        } else this.repaymentMethod();
    },
    createOrder: function(o) {
        wx.showLoading({
            mask: !0,
            title: "加载中...",
            duration: 1e4
        });
        var a = this;
        e.default.networkRequest(t.kscOcOrderSave, o, function(e) {
            wx.hideLoading(), 20 == e.payStatus ? (a.setData({
                orderInfo: null
            }), wx.redirectTo({
                url: "../../order/orderConfirmSuccess/orderConfirmSuccess?payAmount=" + e.payAmount + "&ocOrderId=" + e.docId
            })) : (a.setData({
                orderInfo: e,
                recertification: !1,
                addressChange: !1
            }), a.goPayOrder(e.returnObj));
        }, function() {
            wx.hideLoading();
        });
    },
    repaymentMethod: function() {
        var o = this, a = {
            ocOrderid: this.data.orderInfo.docId
        };
        this.data.addressChange && (a.ocOrderInfo = this.data.pageInfo.ocOrderInfo), this.data.recertification && (a.refreshReal = !0), 
        wx.showLoading({
            mask: !0,
            title: "加载中...",
            duration: 1e4
        }), e.default.networkRequest(t.kscOcOrderRepay, a, function(e) {
            o.setData({
                orderInfo: e,
                recertification: !1,
                addressChange: !1
            }), o.goPayOrder(e.returnObj), wx.hideLoading();
        }, function() {
            wx.hideLoading();
        });
    },
    goPayOrder: function(e) {
        var t = this;
        wx.requestPayment({
            timeStamp: e.timeStamp,
            nonceStr: e.nonceStr,
            package: e.package,
            signType: e.signType,
            paySign: e.paySign,
            success: function(e) {
                var o = t.data.orderInfo.payAmount, a = t.data.orderInfo.docId;
                t.setData({
                    orderInfo: null
                }), wx.redirectTo({
                    url: "../../order/orderConfirmSuccess/orderConfirmSuccess?payAmount=" + o + "&ocOrderId=" + a
                });
            },
            fail: function() {
                t.setData({
                    orderAgainPayShow: !0
                });
            }
        });
    },
    orderAgainPayClose: function() {
        this.setData({
            orderAgainPayShow: !1
        });
    }
});