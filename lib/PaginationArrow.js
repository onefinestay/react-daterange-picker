'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BemMixin = require('./utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var _props = this.props;
    var disabled = _props.disabled;
    var direction = _props.direction;
    var onTrigger = _props.onTrigger;
    var props = (0, _objectWithoutProperties3.default)(_props, ['disabled', 'direction', 'onTrigger']);

    var modifiers = (0, _defineProperty3.default)({}, direction, true);
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
      (0, _extends3.default)({ className: this.cx(elementOpts) }, props, { onClick: onTrigger }),
      _react2.default.createElement('div', { className: this.cx(iconOpts) })
    );
  }
});

exports.default = PaginationArrow;