var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), a = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        systemInfo: null,
        isIphoneX: !1,
        ocOrderId: null,
        pageInfo: null,
        choosedIndex: 0,
        summitDataInfo: null,
        summitSuccess: !1
    },
    onLoad: function(t) {
        wx.hideShareMenu();
        var a = wx.getSystemInfoSync(), e = -1 != a.model.search("iPhone X"), s = {
            ocOrderDetailId: null,
            descScore: 5,
            logisticsScore: 5,
            serviceScore: 5,
            content: "",
            picUrls: [],
            anonymousStatus: 0
        };
        this.setData({
            systemInfo: a,
            isIphoneX: e,
            ocOrderId: this.options.ocOrderId,
            summitDataInfo: s
        }), this.requestOcOrderforcommentList();
    },
    requestOcOrderforcommentList: function() {
        var e = this, s = {
            ocOrderId: this.data.ocOrderId
        };
        t.default.networkRequest(a.kscOcOrderforcommentList, s, function(t) {
            e.setData({
                pageInfo: t
            });
        });
    },
    backButtonMethod: function() {
        if (this.data.summitSuccess) {
            var t = getCurrentPages();
            2 == t.length ? (t[t.length - 2].requestOcOrderInfo(), wx.navigateBack()) : wx.navigateBack({
                delta: 2
            });
        } else wx.navigateBack();
    },
    handleChoosedIndex: function(t) {
        this.setData({
            choosedIndex: t.currentTarget.dataset.index
        });
    },
    onChange: function(t) {
        var a = t.currentTarget.dataset.index;
        0 == a ? this.data.summitDataInfo.descScore = t.detail : 1 == a ? this.data.summitDataInfo.logisticsScore = t.detail : 2 == a && (this.data.summitDataInfo.serviceScore = t.detail), 
        this.setData({
            summitDataInfo: this.data.summitDataInfo
        });
    },
    bindinput: function(t) {
        this.data.summitDataInfo.content = t.detail.value;
    },
    commentImageCloseButtonMethod: function(t) {
        var a = t.currentTarget.dataset.index;
        this.data.summitDataInfo.picUrls.splice(a, 1), this.setData({
            summitDataInfo: this.data.summitDataInfo
        });
    },
    commentImageAdd: function() {
        var t = this;
        wx.chooseImage({
            count: 9 - t.data.summitDataInfo.picUrls.length,
            success: function(a) {
                "chooseImage:ok" == a.errMsg && (wx.showLoading({
                    mask: !0,
                    title: "上传中..."
                }), t.uploadPic(a.tempFilePaths, 0));
            }
        });
    },
    uploadPic: function(e, s) {
        var o = this;
        wx.getFileSystemManager().readFile({
            filePath: e[s],
            encoding: "base64",
            success: function(n) {
                var i = {
                    base64: n.data,
                    type: "oc-comment"
                };
                t.default.networkRequest(a.kscBsOssUpload, i, function(t) {
                    o.data.summitDataInfo.picUrls.push(t), o.setData({
                        summitDataInfo: o.data.summitDataInfo
                    }), e.length == s + 1 ? wx.hideLoading() : o.uploadPic(e, s + 1);
                }, function() {
                    wx.hideLoading();
                });
            }
        });
    },
    anonymousStatusChange: function() {
        1 == this.data.summitDataInfo.anonymousStatus ? this.data.summitDataInfo.anonymousStatus = 0 : this.data.summitDataInfo.anonymousStatus = 1, 
        this.setData({
            summitDataInfo: this.data.summitDataInfo
        });
    },
    summitButtonMethod: function() {
        var e = JSON.parse(JSON.stringify(this.data.summitDataInfo));
        if (e.ocOrderDetailId = this.data.pageInfo.ocOrderDetails[this.data.choosedIndex].ocOrderDetailId, 
        0 != e.descScore && 0 != e.logisticsScore && 0 != e.serviceScore) {
            for (var s = [], o = 0; o < e.picUrls.length; o++) s.push(e.picUrls[o].url);
            e.picUrls = s;
            var n = this;
            t.default.networkRequest(a.kscOcCommentSave, e, function(t) {
                if (0 == t.ocOrderDetails.length) n.setData({
                    summitSuccess: !0
                }); else {
                    wx.showToast({
                        title: "评价成功，开始评价下一个商品",
                        icon: "none"
                    });
                    var a = {
                        ocOrderDetailId: null,
                        descScore: 5,
                        logisticsScore: 5,
                        serviceScore: 5,
                        content: "",
                        picUrls: [],
                        anonymousStatus: 0
                    };
                    n.setData({
                        pageInfo: t,
                        choosedIndex: 0,
                        summitDataInfo: a
                    });
                }
            });
        } else wx.showToast({
            title: "你还没有选择星级评分",
            icon: "none"
        });
    }
});