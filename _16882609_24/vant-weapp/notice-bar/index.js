var t = function() {
    function t(t, e) {
        var i = [], n = !0, r = !1, a = void 0;
        try {
            for (var o, l = t[Symbol.iterator](); !(n = (o = l.next()).done) && (i.push(o.value), 
            !e || i.length !== e); n = !0) ;
        } catch (t) {
            r = !0, a = t;
        } finally {
            try {
                !n && l.return && l.return();
            } finally {
                if (r) throw a;
            }
        }
        return i;
    }
    return function(e, i) {
        if (Array.isArray(e)) return e;
        if (Symbol.iterator in Object(e)) return t(e, i);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}();

(0, require("../common/component").VantComponent)({
    props: {
        text: {
            type: String,
            value: ""
        },
        mode: {
            type: String,
            value: ""
        },
        url: {
            type: String,
            value: ""
        },
        openType: {
            type: String,
            value: "navigate"
        },
        delay: {
            type: Number,
            value: 1
        },
        speed: {
            type: Number,
            value: 50
        },
        scrollable: {
            type: Boolean,
            value: !0
        },
        leftIcon: {
            type: String,
            value: ""
        },
        color: {
            type: String,
            value: "#ed6a0c"
        },
        backgroundColor: {
            type: String,
            value: "#fffbe8"
        },
        wrapable: Boolean
    },
    data: {
        show: !0
    },
    watch: {
        text: function() {
            this.set({}, this.init);
        }
    },
    created: function() {
        this.resetAnimation = wx.createAnimation({
            duration: 0,
            timingFunction: "linear"
        });
    },
    destroyed: function() {
        this.timer && clearTimeout(this.timer);
    },
    methods: {
        init: function() {
            var e = this;
            Promise.all([ this.getRect(".van-notice-bar__content"), this.getRect(".van-notice-bar__wrap") ]).then(function(i) {
                var n = t(i, 2), r = n[0], a = n[1];
                if (null != r && null != a && r.width && a.width) {
                    var o = e.data, l = o.speed, u = o.scrollable, s = o.delay;
                    if (u && a.width < r.width) {
                        var c = r.width / l * 1e3;
                        e.wrapWidth = a.width, e.contentWidth = r.width, e.duration = c, e.animation = wx.createAnimation({
                            duration: c,
                            timingFunction: "linear",
                            delay: s
                        }), e.scroll();
                    }
                }
            });
        },
        scroll: function() {
            var t = this;
            this.timer && clearTimeout(this.timer), this.timer = null, this.set({
                animationData: this.resetAnimation.translateX(this.wrapWidth).step().export()
            }), setTimeout(function() {
                t.set({
                    animationData: t.animation.translateX(-t.contentWidth).step().export()
                });
            }, 20), this.timer = setTimeout(function() {
                t.scroll();
            }, this.duration);
        },
        onClickIcon: function() {
            this.timer && clearTimeout(this.timer), this.timer = null, this.set({
                show: !1
            });
        },
        onClick: function(t) {
            this.$emit("click", t);
        }
    }
});