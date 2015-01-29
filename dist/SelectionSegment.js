"use strict";
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var SelectionSegment = React.createClass({
  displayName: "SelectionSegment",
  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement("div", { className: "reactDaterangePicker__selection reactDaterangePicker__selection--segment" });
  }
});

module.exports = SelectionSegment;