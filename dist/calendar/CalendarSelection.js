'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BemMixin = require('../utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

var _PureRenderMixin = require('../utils/PureRenderMixin');

var _PureRenderMixin2 = _interopRequireDefault(_PureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CalendarSelection = _react2.default.createClass({
  displayName: 'CalendarSelection',

  mixins: [_BemMixin2.default, _PureRenderMixin2.default],

  propTypes: {
    modifier: _react2.default.PropTypes.string,
    pending: _react2.default.PropTypes.bool.isRequired
  },

  render: function render() {
    var _props = this.props,
        modifier = _props.modifier,
        pending = _props.pending;

    var modifiers = _defineProperty({}, modifier, true);
    var states = {
      pending: pending
    };

    return _react2.default.createElement('div', { className: this.cx({ states: states, modifiers: modifiers }) });
  }
});

exports.default = CalendarSelection;