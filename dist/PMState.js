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
    var style = {};
    var classes = {
      reactDaterangePicker__halfDay: true,
      "reactDaterangePicker__halfDay--pm": true
    };
    if (this.props.color) {
      style.backgroundColor = this.props.color;
    }

    return React.createElement("div", { style: style, className: cx(classes) });
  }
});

module.exports = PMState;