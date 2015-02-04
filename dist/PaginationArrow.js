"use strict";
var _objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

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

var BemMixin = _interopRequire(require("./utils/BemMixin"));

var PureRenderMixin = React.addons.PureRenderMixin;


var PaginationArrow = React.createClass({
  displayName: "PaginationArrow",
  mixins: [BemMixin, PureRenderMixin],

  render: function render() {
    var disabled = this.props.disabled;
    var direction = this.props.direction;
    var props = _objectWithoutProperties(this.props, ["disabled", "direction"]);

    var modifiers = _defineProperty({}, direction, true);
    var states = { disabled: disabled };

    var elementOpts = {
      modifiers: modifiers,
      states: states
    };

    var iconOpts = {
      element: "PaginationArrowIcon",
      modifiers: modifiers,
      states: states
    };

    return React.createElement(
      "div",
      React.__spread({ className: this.cx(elementOpts) }, props),
      React.createElement("div", { className: this.cx(iconOpts) })
    );
  }
});

module.exports = PaginationArrow;