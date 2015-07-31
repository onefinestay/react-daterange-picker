'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _utilsBemMixin = require('./utils/BemMixin');

var _utilsBemMixin2 = _interopRequireDefault(_utilsBemMixin);

var PureRenderMixin = _reactAddons2['default'].addons.PureRenderMixin;

var PaginationArrow = _reactAddons2['default'].createClass({
  displayName: 'PaginationArrow',

  mixins: [_utilsBemMixin2['default'], PureRenderMixin],

  propTypes: {
    disabled: _reactAddons2['default'].PropTypes.bool,
    onTrigger: _reactAddons2['default'].PropTypes.func,
    direction: _reactAddons2['default'].PropTypes.oneOf(['next', 'previous']) },

  getDefaultProps: function getDefaultProps() {
    return {
      disabled: false };
  },

  render: function render() {
    var _props = this.props;
    var disabled = _props.disabled;
    var direction = _props.direction;
    var onTrigger = _props.onTrigger;

    var props = _objectWithoutProperties(_props, ['disabled', 'direction', 'onTrigger']);

    var modifiers = _defineProperty({}, direction, true);
    var states = { disabled: disabled };

    var elementOpts = {
      modifiers: modifiers,
      states: states };

    var iconOpts = {
      element: 'PaginationArrowIcon',
      modifiers: modifiers,
      states: states };

    return _reactAddons2['default'].createElement(
      'div',
      _extends({ className: this.cx(elementOpts) }, props, { onClick: onTrigger }),
      _reactAddons2['default'].createElement('div', { className: this.cx(iconOpts) })
    );
  } });

exports['default'] = PaginationArrow;
module.exports = exports['default'];