var t = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("../../../utils/network/network.js")), e = require("../../../utils/network/urlMacroFile.js");

Page({
    data: {
        systemInfo: null,
        isIphoneX: !1,
        options: null,
        commentList: [],
        page: null,
        total: null,
        totalPage: null,
        lookBigPicShow: !1,
        lookBigPicList: [],
        current: 0
    },
    onLoad: function(t) {
        wx.hideShareMenu();
        var e = wx.getSystemInfoSync(), a = -1 != e.model.search("iPhone X");
        this.setData({
            systemInfo: e,
            isIphoneX: a,
            options: t
        }), this.requestCommentPageInfo();
    },
    onReachBottom: function() {
        this.data.page + 1 < this.data.totalPage && this.requestCommentPageInfo(this.data.page + 1);
    },
    requestCommentPageInfo: function(a) {
        var o = this, i = {
            total: this.data.total,
            page: a,
            pdSpuId: this.data.options.pdSpuId
        };
        t.default.networkRequest(e.kscPdSpuCommentQuery, i, function(t) {
            0 == a && (o.data.commentList = []), o.setData({
                page: t.page,
                totalPage: t.totalPage,
                total: t.total,
                commentList: o.data.commentList.concat(t.result)
            });
        });
    },
    backButtonMethod: function() {
        this.data.options.backFirst ? wx.switchTab({
            url: "../../spu/homePage/homePage"
        }) : wx.navigateBack();
    },
    lookBigPic: function(t) {
        this.setData({
            lookBigPicList: this.data.commentList[t.currentTarget.dataset.index].ocCommentPics,
            current: t.currentTarget.dataset.imageindex,
            lookBigPicShow: !0
        });
    },
    lookBigPicClose: function() {
        this.setData({
            lookBigPicShow: !1
        });
    },
    swiperChange: function(t) {
        this.setData({
            current: t.detail.current
        });
    }
});