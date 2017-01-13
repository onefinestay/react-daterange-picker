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

var CalendarDatePeriod = _react2.default.createClass({
  displayName: 'CalendarDatePeriod',

  mixins: [_BemMixin2.default, _PureRenderMixin2.default],

  propTypes: {
    color: _react2.default.PropTypes.string,
    period: _react2.default.PropTypes.string
  },

  render: function render() {
    var _props = this.props,
        color = _props.color,
        period = _props.period;

    var modifiers = _defineProperty({}, period, true);
    var style = void 0;

    if (color) {
      style = { backgroundColor: color };
    }

    return _react2.default.createElement('div', { style: style, className: this.cx({ modifiers: modifiers }) });
  }
});

exports.default = CalendarDatePeriod;