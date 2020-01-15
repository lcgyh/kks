var e = require("../common/component"), o = require("../mixins/button"), n = require("../mixins/open-type");

(0, e.VantComponent)({
    mixins: [ o.button, n.openType ],
    classes: [ "hover-class", "loading-class" ],
    props: {
        plain: Boolean,
        block: Boolean,
        round: Boolean,
        square: Boolean,
        loading: Boolean,
        hairline: Boolean,
        disabled: Boolean,
        loadingText: String,
        type: {
            type: String,
            value: "default"
        },
        size: {
            type: String,
            value: "normal"
        },
        loadingSize: {
            type: String,
            value: "20px"
        }
    },
    methods: {
        onClick: function() {
            this.data.disabled || this.data.loading || this.$emit("click");
        }
    }
});