'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BemMixin = require('./utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var PaginationArrow = _react2.default.createClass({
  displayName: 'PaginationArrow',

  mixins: [_BemMixin2.default, _reactAddonsPureRenderMixin2.default],

  propTypes: {
    disabled: _react2.default.PropTypes.bool,
    onTrigger: _react2.default.PropTypes.func,
    direction: _react2.default.PropTypes.oneOf(['next', 'previous'])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      disabled: false
    };
  },
  render: function render() {
    var _props = this.props,
        disabled = _props.disabled,
        direction = _props.direction,
        onTrigger = _props.onTrigger,
        props = _objectWithoutProperties(_props, ['disabled', 'direction', 'onTrigger']);

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

    return _react2.default.createElement(
      'div',
      _extends({ className: this.cx(elementOpts) }, props, { onClick: onTrigger }),
      _react2.default.createElement('div', { className: this.cx(iconOpts) })
    );
  }
});

exports.default = PaginationArrow;