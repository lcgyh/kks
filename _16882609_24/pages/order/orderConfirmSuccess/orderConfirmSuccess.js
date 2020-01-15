Page({
    data: {},
    onLoad: function(e) {
        wx.hideShareMenu(), this.setData({
            options: e
        });
    },
    goHomePage: function() {
        wx.switchTab({
            url: "../../spu/homePage/homePage"
        });
    },
    goOrderDetail: function() {
        wx.reLaunch({
            url: "../../order/orderDetail/orderDetail?ocOrderId=" + this.data.options.ocOrderId + "&backFirst=true"
        });
    }
});