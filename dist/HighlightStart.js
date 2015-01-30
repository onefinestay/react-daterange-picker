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
    var classes = {
      reactDaterangePicker__highlight: true,
      "reactDaterangePicker__highlight--start": true,
      "reactDaterangePicker__highlight--is-inOtherMonth": this.props.isInOtherMonth
    };

    return React.createElement("div", { className: cx(classes) });
  }
});

module.exports = HighlightStart;