var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("../../../utils/network/network.js")), a = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        systemInfo: null,
        isIphoneX: !1,
        ucReal: null,
        showBondProductNotice: !1
    },
    onLoad: function(e) {
        wx.hideShareMenu();
        var a = wx.getSystemInfoSync(), t = -1 != a.model.search("iPhone X");
        this.setData({
            systemInfo: a,
            isIphoneX: t,
            options: e
        }), this.requestUcRealDefaultInfo();
    },
    requestUcRealDefaultInfo: function() {
        var t = this;
        e.default.networkRequest(a.kscUcRealDefaultInfo, null, function(e) {
            void 0 == e.ucReal ? t.setData({
                ucReal: {}
            }) : t.setData({
                ucReal: e.ucReal
            });
        });
    },
    userProtocolShow: function() {
        this.setData({
            showBondProductNotice: !0
        });
    },
    userProtocolHidden: function() {
        this.setData({
            showBondProductNotice: !1
        });
    },
    nameInput: function(e) {
        this.data.ucReal.realName = e.detail.value, this.setData({
            ucReal: this.data.ucReal
        });
    },
    idcardInput: function(e) {
        this.data.ucReal.idNo = e.detail.value, this.setData({
            ucReal: this.data.ucReal
        });
    },
    numberInput: function(e) {
        this.data.ucReal.realMobile = e.detail.value, this.setData({
            ucReal: this.data.ucReal
        });
    },
    idPicUrlUpload: function(t) {
        var l = this, i = 0 == t.currentTarget.dataset.index;
        wx.chooseImage({
            success: function(t) {
                "chooseImage:ok" == t.errMsg && wx.getFileSystemManager().readFile({
                    filePath: t.tempFilePaths[0],
                    encoding: "base64",
                    success: function(t) {
                        var o = {
                            base64: t.data,
                            type: "uc-real"
                        };
                        wx.showLoading({
                            mask: !0,
                            title: "上传中...",
                            duration: 1e4
                        }), e.default.networkRequest(a.kscBsOssUpload, o, function(e) {
                            wx.hideLoading(), i ? (l.data.ucReal.idPicUrl = e.url, l.data.ucReal.idPicUrlAll = e.urlAll, 
                            l.setData({
                                ucReal: l.data.ucReal
                            })) : (l.data.ucReal.id2PicUrl = e.url, l.data.ucReal.id2PicUrlAll = e.urlAll, l.setData({
                                ucReal: l.data.ucReal
                            }));
                        }, function() {
                            wx.hideLoading();
                        });
                    }
                });
            }
        });
    },
    submitButtonMethod: function() {
        var t = {
            ucReal: this.data.ucReal
        };
        if (void 0 != t.ucReal.realName && 0 != t.ucReal.realName.length) if (void 0 != t.ucReal.idNo && 0 != t.ucReal.idNo.length) if (void 0 != t.ucReal.realMobile && 0 != t.ucReal.realMobile.length) if (void 0 != t.ucReal.idPicUrl && 0 != t.ucReal.idPicUrl.length) if (void 0 != t.ucReal.id2PicUrl && 0 != t.ucReal.id2PicUrl.length) {
            var l = this;
            e.default.networkRequest(a.kscUcRealDefaultSave, t, function(e) {
                if (!l.data.options.userCenter) {
                    var a = getCurrentPages(), t = a[a.length - 2];
                    t.data.pageInfo.ocOrder.ocOrderInfo.realName = e.ucReal.realName, t.data.pageInfo.ocOrder.ocOrderInfo.idNoEncryption = e.ucReal.idNoEncryption, 
                    t.setData({
                        pageInfo: t.data.pageInfo,
                        recertification: !0
                    });
                }
                wx.navigateBack();
            });
        } else wx.showToast({
            title: "请上传身份证反面照片",
            icon: "none"
        }); else wx.showToast({
            title: "请上传身份证正面照片",
            icon: "none"
        }); else wx.showToast({
            title: "请输入手机号",
            icon: "none"
        }); else wx.showToast({
            title: "请输入身份证号",
            icon: "none"
        }); else wx.showToast({
            title: "请输入真实姓名",
            icon: "none"
        });
    }
});