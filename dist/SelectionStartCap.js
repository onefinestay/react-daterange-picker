"use strict";
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var AMState = React.createClass({
  displayName: "AMState",
  mixins: [PureRenderMixin],

  render: function render() {
    var style = {};
    var classes = {
      reactDaterangePicker__halfDay: true,
      "reactDaterangePicker__halfDay--am": true
    };
    if (this.props.color) {
      style.backgroundColor = this.props.color;
    }

    return React.createElement("div", { style: style, className: cx(classes) });
  }
});

module.exports = AMState;