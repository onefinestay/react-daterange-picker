"use strict";
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var HighlightStart = React.createClass({
  displayName: "HighlightStart",
  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement("div", { className: "reactDaterangePicker__highlight reactDaterangePicker__highlight--start" });
  }
});

module.exports = HighlightStart;