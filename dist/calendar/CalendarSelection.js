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


var CalendarSelection = React.createClass({
  displayName: "CalendarSelection",
  mixins: [BemMixin, PureRenderMixin],

  render: function render() {
    var modifier = this.props.modifier;
    var inOtherMonth = this.props.inOtherMonth;
    var element = "CalendarSelection";
    var modifiers = _defineProperty({}, modifier, true);
    var states = {
      inOtherMonth: inOtherMonth
    };

    return React.createElement("div", { className: this.cx({ element: element, states: states, modifiers: modifiers }) });
  }
});

module.exports = CalendarSelection;