function e(e) {
    return (0, o.isObj)(e) ? e : {
        message: e
    };
}

function t() {
    var e = getCurrentPages();
    return e[e.length - 1];
}

function n(n) {
    var o = Object.assign({}, i, e(n)), s = (o.context || t()).selectComponent(o.selector);
    if (s) return delete o.context, delete o.selector, s.clear = function() {
        s.set({
            show: !1
        }), o.onClose && o.onClose();
    }, r.push(s), s.set(o), clearTimeout(s.timer), o.duration > 0 && (s.timer = setTimeout(function() {
        s.clear(), r = r.filter(function(e) {
            return e !== s;
        });
    }, o.duration)), s;
    console.warn("未找到 van-toast 节点，请确认 selector 及 context 是否正确");
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var o = require("../common/utils"), s = {
    type: "text",
    mask: !1,
    message: "",
    show: !0,
    zIndex: 1e3,
    duration: 3e3,
    position: "middle",
    forbidClick: !1,
    loadingType: "circular",
    selector: "#van-toast"
}, r = [], i = Object.assign({}, s), c = function(t) {
    return function(o) {
        return n(Object.assign({
            type: t
        }, e(o)));
    };
};

n.loading = c("loading"), n.success = c("success"), n.fail = c("fail"), n.clear = function() {
    r.forEach(function(e) {
        e.clear();
    }), r = [];
}, n.setDefaultOptions = function(e) {
    Object.assign(i, e);
}, n.resetDefaultOptions = function() {
    i = Object.assign({}, s);
}, exports.default = n;