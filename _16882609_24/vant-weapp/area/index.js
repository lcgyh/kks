var e = function() {
    function e(e, t) {
        var n = [], i = !0, r = !1, s = void 0;
        try {
            for (var c, u = e[Symbol.iterator](); !(i = (c = u.next()).done) && (n.push(c.value), 
            !t || n.length !== t); i = !0) ;
        } catch (e) {
            r = !0, s = e;
        } finally {
            try {
                !i && u.return && u.return();
            } finally {
                if (r) throw s;
            }
        }
        return n;
    }
    return function(t, n) {
        if (Array.isArray(t)) return t;
        if (Symbol.iterator in Object(t)) return e(t, n);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    };
}(), t = require("../common/component"), n = require("../picker/shared");

(0, t.VantComponent)({
    classes: [ "active-class", "toolbar-class", "column-class" ],
    props: Object.assign({}, n.pickerProps, {
        value: String,
        areaList: {
            type: Object,
            value: {}
        },
        columnsNum: {
            type: [ String, Number ],
            value: 3
        }
    }),
    data: {
        columns: [ {
            values: []
        }, {
            values: []
        }, {
            values: []
        } ],
        displayColumns: [ {
            values: []
        }, {
            values: []
        }, {
            values: []
        } ]
    },
    watch: {
        value: function(e) {
            this.code = e, this.setValues();
        },
        areaList: "setValues",
        columnsNum: function(e) {
            this.set({
                displayColumns: this.data.columns.slice(0, +e)
            });
        }
    },
    mounted: function() {
        this.setValues();
    },
    methods: {
        getPicker: function() {
            return null == this.picker && (this.picker = this.selectComponent(".van-area__picker")), 
            this.picker;
        },
        onCancel: function(e) {
            this.emit("cancel", e.detail);
        },
        onConfirm: function(e) {
            this.emit("confirm", e.detail);
        },
        emit: function(e, t) {
            t.values = t.value, delete t.value, this.$emit(e, t);
        },
        onChange: function(e) {
            var t = this, n = e.detail, i = n.index, r = n.picker, s = n.value;
            this.code = s[i].code, this.setValues().then(function() {
                t.$emit("change", {
                    picker: r,
                    values: r.getValues(),
                    index: i
                });
            });
        },
        getConfig: function(e) {
            var t = this.data.areaList;
            return t && t[e + "_list"] || {};
        },
        getList: function(e, t) {
            var n = [];
            if ("province" !== e && !t) return n;
            var i = this.getConfig(e);
            return n = Object.keys(i).map(function(e) {
                return {
                    code: e,
                    name: i[e]
                };
            }), t && ("9" === t[0] && "city" === e && (t = "9"), n = n.filter(function(e) {
                return 0 === e.code.indexOf(t);
            })), n;
        },
        getIndex: function(e, t) {
            var n = "province" === e ? 2 : "city" === e ? 4 : 6, i = this.getList(e, t.slice(0, n - 2));
            "9" === t[0] && "province" === e && (n = 1), t = t.slice(0, n);
            for (var r = 0; r < i.length; r++) if (i[r].code.slice(0, n) === t) return r;
            return 0;
        },
        setValues: function() {
            var t = this, n = this.getConfig("county"), i = this.code || Object.keys(n)[0] || "", r = this.getList("province"), s = this.getList("city", i.slice(0, 2)), c = this.getPicker();
            if (c) {
                var u = [];
                if (u.push(c.setColumnValues(0, r, !1)), u.push(c.setColumnValues(1, s, !1)), s.length && "00" === i.slice(2, 4)) {
                    var o = e(s, 1);
                    i = o[0].code;
                }
                return u.push(c.setColumnValues(2, this.getList("county", i.slice(0, 4)), !1)), 
                Promise.all(u).catch(function() {}).then(function() {
                    return c.setIndexes([ t.getIndex("province", i), t.getIndex("city", i), t.getIndex("county", i) ]);
                }).catch(function() {});
            }
        },
        getValues: function() {
            var e = this.getPicker();
            return e ? e.getValues().filter(function(e) {
                return !!e;
            }) : [];
        },
        getDetail: function() {
            var e = this.getValues(), t = {
                code: "",
                country: "",
                province: "",
                city: "",
                county: ""
            };
            if (!e.length) return t;
            var n = e.map(function(e) {
                return e.name;
            });
            return t.code = e[e.length - 1].code, "9" === t.code[0] ? (t.country = n[1] || "", 
            t.province = n[2] || "") : (t.province = n[0] || "", t.city = n[1] || "", t.county = n[2] || ""), 
            t;
        },
        reset: function() {
            return this.code = "", this.setValues();
        }
    }
});