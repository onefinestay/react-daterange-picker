"use strict";
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var PMState = React.createClass({
  displayName: "PMState",
  mixins: [PureRenderMixin],

  render: function render() {
    var i;
    var classes = {
      reactDaterangePicker__halfDay: true,
      "reactDaterangePicker__halfDay--pm": true
    };
    if (this.props.availabilityAction) {
      classes["reactDaterangePicker__halfDay--is-" + this.props.availabilityAction] = true;
    }
    if (this.props.displayStates) {
      for (i = 0; i < this.props.displayStates.length; i++) {
        classes["reactDaterangePicker__halfDay--is-" + this.props.displayStates[i]] = true;
      }
    }

    return React.createElement("div", { className: cx(classes) });
  }
});

module.exports = PMState;