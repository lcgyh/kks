var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), t = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        isWhiteBar: !1,
        ocOrderInfo: null,
        intervarID: null,
        payTime: 0
    },
    onLoad: function(e) {
        wx.hideShareMenu();
        var t = wx.getSystemInfoSync(), r = -1 != t.model.search("iPhone X");
        this.setData({
            systemInfo: t,
            isIphoneX: r,
            options: e
        }), this.requestOcOrderInfo();
    },
    onPageScroll: function(e) {
        var t = e.scrollTop;
        t < this.data.systemInfo.screenWidth / 3 && this.data.isWhiteBar ? this.setData({
            isWhiteBar: !1
        }) : t > this.data.systemInfo.screenWidth / 3 && !this.data.isWhiteBar && this.setData({
            isWhiteBar: !0
        });
    },
    requestOcOrderInfo: function() {
        var r = this, o = {
            ocOrderId: this.data.options.ocOrderId
        };
        e.default.networkRequest(t.kscOcOrderInfo, o, function(e) {
            90 == e.ocOrder.showStatus && 0 == e.ocOrder.commentStatus && (e.ocOrder.showStatus = 80, 
            e.ocOrder.showStatusStr = "待评价");
            for (var t = Date.parse(new Date()), o = 0, a = 0, n = 0, s = 0; s < e.bsLogs.length; s++) "oc_order_delivery" == e.bsLogs[s].action ? o = e.bsLogs[s].createTime : "oc_order_receive" == e.bsLogs[s].action ? a = e.bsLogs[s].createTime : "oc_order_receive_auto" == e.bsLogs[s].action ? a = e.bsLogs[s].createTime : "oc_order_comment" == e.bsLogs[s].action && (n = e.bsLogs[s].createTime);
            r.setData({
                ocOrderInfo: e,
                nowtimestamp: t,
                deliveryTime: o,
                receiveTime: a,
                commentTime: n
            }), 10 == e.ocOrder.showStatus && r.getNowTime(e);
        });
    },
    getNowTime: function(e) {
        var t = this, r = e.ocOrder.payTimeET;
        this.data.intervarID = setInterval(function() {
            var e = Date.parse(new Date());
            r < e ? clearInterval(t.data.intervarID) : t.setData({
                nowtimestamp: e
            });
        }, 1e3);
    },
    backButtonMethod: function() {
        this.data.options.backFirst ? wx.switchTab({
            url: "../../spu/homePage/homePage"
        }) : wx.navigateBack();
    },
    phoneCall: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.ocOrderInfo.ocOrder.spShop.contactTel
        });
    },
    goShopButton: function() {},
    goSpuDetail: function(e) {
        var t = this.data.ocOrderInfo.ocOrder.ocOrderDetails[e.currentTarget.dataset.index].pdItemId;
        wx.navigateTo({
            url: "../../spu/spuDetail/spuDetail?pdItemId=" + t
        });
    },
    orderNoCopyButtonMethod: function() {
        var e = this;
        wx.setClipboardData({
            data: e.data.ocOrderInfo.ocOrder.orderNo,
            success: function(e) {
                wx.showToast({
                    title: "复制成功",
                    icon: "none"
                });
            }
        });
    },
    cancelButtonMethod: function() {
        var r = this, o = {
            ocOrderId: this.data.options.ocOrderId,
            cancelStatus: 21
        };
        e.default.networkRequest(t.kscOcOrderCancel, o, function() {
            clearInterval(r.data.intervarID), r.requestOcOrderInfo();
        });
    },
    goLogisticsInfo: function(e) {
        wx.navigateTo({
            url: "../logisticsInfo/logisticsInfo?ocPackageId=" + this.data.ocOrderInfo.ocOrder.ocPackages[e.currentTarget.dataset.index].ocPackageId
        });
    },
    goPayOrder: function() {
        var r = this, o = {
            ocOrderId: this.data.options.ocOrderId
        };
        wx.showLoading({
            mask: !0,
            title: "加载中...",
            duration: 1e4
        }), wx.requestSubscribeMessage({
            tmplIds: [ "OG56_L2S6LS9D9wfy0b_yl3aBz3VmfbM4c1oRNg-9GQ" ]
        }), e.default.networkRequest(t.kscOcOrderRepay, o, function(e) {
            wx.hideLoading(), wx.requestPayment({
                timeStamp: e.returnObj.timeStamp,
                nonceStr: e.returnObj.nonceStr,
                package: e.returnObj.package,
                signType: e.returnObj.signType,
                paySign: e.returnObj.paySign,
                success: function(e) {
                    clearInterval(r.data.intervarID), r.requestOcOrderInfo();
                }
            });
        }, function() {
            wx.hideLoading();
        });
    },
    sureReceiveButtonMethod: function() {
        var r = this;
        wx.showModal({
            title: "确认收到货了吗？",
            content: "为保障你的售后权益，请收到货确认无误后再确认收货哦！",
            cancelColor: "#B2B2B2",
            confirmText: "确认收货",
            confirmColor: "#5F7FDC",
            success: function(o) {
                if (o.confirm) {
                    var a = {
                        ocOrderId: r.data.options.ocOrderId
                    };
                    e.default.networkRequest(t.kscOcOrderReceive, a, function() {
                        clearInterval(r.data.intervarID), r.requestOcOrderInfo(), r.goComment();
                    });
                }
            }
        });
    },
    goComment: function() {
        wx.navigateTo({
            url: "../../order/commentPage/commentPage?ocOrderId=" + this.data.options.ocOrderId
        });
    }
});