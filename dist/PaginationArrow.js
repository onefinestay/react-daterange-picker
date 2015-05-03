'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _React = require('react/addons');

var _React2 = _interopRequireDefault(_React);

var _BemMixin = require('./utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

'use strict';

var PureRenderMixin = _React2['default'].addons.PureRenderMixin;

var PaginationArrow = _React2['default'].createClass({
  displayName: 'PaginationArrow',

  mixins: [_BemMixin2['default'], PureRenderMixin],

  render: function render() {
    var _props = this.props;
    var disabled = _props.disabled;
    var direction = _props.direction;

    var props = _objectWithoutProperties(_props, ['disabled', 'direction']);

    var modifiers = _defineProperty({}, direction, true);
    var states = { disabled: disabled };

    var elementOpts = {
      modifiers: modifiers,
      states: states
    };

    var iconOpts = {
      element: 'PaginationArrowIcon',
      modifiers: modifiers,
      states: states
    };

    return _React2['default'].createElement(
      'div',
      _extends({ className: this.cx(elementOpts) }, props),
      _React2['default'].createElement('div', { className: this.cx(iconOpts) })
    );
  }
});

exports['default'] = PaginationArrow;
module.exports = exports['default'];