(0, require("../common/component").VantComponent)({
    field: !0,
    classes: [ "input-class", "plus-class", "minus-class" ],
    props: {
        value: null,
        integer: Boolean,
        disabled: Boolean,
        inputWidth: String,
        asyncChange: Boolean,
        disableInput: Boolean,
        min: {
            type: null,
            value: 1
        },
        max: {
            type: null,
            value: Number.MAX_SAFE_INTEGER
        },
        step: {
            type: null,
            value: 1
        }
    },
    computed: {
        minusDisabled: function() {
            return this.data.disabled || this.data.value <= this.data.min;
        },
        plusDisabled: function() {
            return this.data.disabled || this.data.value >= this.data.max;
        }
    },
    watch: {
        value: function(t) {
            if ("" !== t) {
                var a = this.range(t);
                "number" == typeof a && +this.data.value !== a && this.set({
                    value: a
                });
            }
        }
    },
    data: {
        focus: !1
    },
    created: function() {
        this.set({
            value: this.range(this.data.value)
        });
    },
    methods: {
        onFocus: function(t) {
            this.$emit("focus", t.detail);
        },
        onBlur: function(t) {
            var a = this.range(this.data.value);
            this.triggerInput(a), this.$emit("blur", t.detail);
        },
        range: function(t) {
            return t = String(t).replace(/[^0-9.-]/g, ""), Math.max(Math.min(this.data.max, t), this.data.min);
        },
        onInput: function(t) {
            var a = (t.detail || {}).value, i = void 0 === a ? "" : a;
            this.triggerInput(i);
        },
        onChange: function(t) {
            if (this.data[t + "Disabled"]) this.$emit("overlimit", t); else {
                var a = "minus" === t ? -this.data.step : +this.data.step, i = Math.round(100 * (this.data.value + a)) / 100;
                this.triggerInput(this.range(i)), this.$emit(t);
            }
        },
        onMinus: function() {
            this.onChange("minus");
        },
        onPlus: function() {
            this.onChange("plus");
        },
        triggerInput: function(t) {
            this.set({
                value: this.data.asyncChange ? this.data.value : t
            }), this.$emit("change", t);
        }
    }
});