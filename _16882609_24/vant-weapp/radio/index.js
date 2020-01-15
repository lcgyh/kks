(0, require("../common/component").VantComponent)({
    field: !0,
    relation: {
        name: "radio-group",
        type: "ancestor",
        linked: function(e) {
            this.parent = e;
        },
        unlinked: function() {
            this.parent = null;
        }
    },
    classes: [ "icon-class", "label-class" ],
    props: {
        value: null,
        disabled: Boolean,
        useIconSlot: Boolean,
        checkedColor: String,
        labelPosition: String,
        labelDisabled: Boolean,
        shape: {
            type: String,
            value: "round"
        }
    },
    methods: {
        emitChange: function(e) {
            var n = this.parent || this;
            n.$emit("input", e), n.$emit("change", e);
        },
        onChange: function(e) {
            console.log(e), this.emitChange(this.data.name);
        },
        onClickLabel: function() {
            var e = this.data, n = e.disabled, a = e.labelDisabled, t = e.name;
            n || a || this.emitChange(t);
        }
    }
});