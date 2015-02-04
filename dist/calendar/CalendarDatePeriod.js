"use strict";
var _defineProperty = function (obj, key, value) {
  return Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: true
  });
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var BemMixin = _interopRequire(require("../utils/BemMixin"));

var PureRenderMixin = React.addons.PureRenderMixin;

var CalendarDatePeriod = React.createClass({
  displayName: "CalendarDatePeriod",
  mixins: [BemMixin, PureRenderMixin],

  render: function render() {
    var color = this.props.color;
    var period = this.props.period;
    var modifiers = _defineProperty({}, period, true);
    var style;

    if (color) {
      style = { backgroundColor: color };
    }

    return React.createElement("div", { style: style, className: this.cx({ modifiers: modifiers }) });
  }
});

module.exports = CalendarDatePeriod;