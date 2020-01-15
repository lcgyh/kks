(0, require("../common/component").VantComponent)({
    field: !0,
    props: {
        value: null,
        title: String,
        border: Boolean,
        checked: Boolean,
        loading: Boolean,
        disabled: Boolean,
        activeColor: String,
        inactiveColor: String,
        size: {
            type: String,
            value: "24px"
        },
        activeValue: {
            type: null,
            value: !0
        },
        inactiveValue: {
            type: null,
            value: !1
        }
    },
    watch: {
        checked: function(e) {
            this.set({
                value: e
            });
        }
    },
    created: function() {
        this.set({
            value: this.data.checked
        });
    },
    methods: {
        onChange: function(e) {
            this.$emit("change", e.detail);
        }
    }
});