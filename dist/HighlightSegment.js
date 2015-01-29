"use strict";
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var HightlightSegment = React.createClass({
  displayName: "HightlightSegment",
  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement("div", { className: "reactDaterangePicker__highlight reactDaterangePicker__highlight--segment" });
  }
});

module.exports = HightlightSegment;