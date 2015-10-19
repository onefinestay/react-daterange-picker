'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilsBemMixin = require('../utils/BemMixin');

var _utilsBemMixin2 = _interopRequireDefault(_utilsBemMixin);

var _utilsPureRenderMixin = require('../utils/PureRenderMixin');

var _utilsPureRenderMixin2 = _interopRequireDefault(_utilsPureRenderMixin);

var CalendarDatePeriod = _react2['default'].createClass({
  displayName: 'CalendarDatePeriod',

  mixins: [_utilsBemMixin2['default'], _utilsPureRenderMixin2['default']],

  propTypes: {
    color: _react2['default'].PropTypes.string,
    period: _react2['default'].PropTypes.string
  },

  render: function render() {
    var _props = this.props;
    var color = _props.color;
    var period = _props.period;

    var modifiers = _defineProperty({}, period, true);
    var style = undefined;

    if (color) {
      style = { backgroundColor: color };
    }

    return _react2['default'].createElement('div', { style: style, className: this.cx({ modifiers: modifiers }) });
  }
});

exports['default'] = CalendarDatePeriod;
module.exports = exports['default'];