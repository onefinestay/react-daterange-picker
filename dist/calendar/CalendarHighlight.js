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

var CalendarHighlight = _react2['default'].createClass({
  displayName: 'CalendarHighlight',

  mixins: [_utilsBemMixin2['default'], _utilsPureRenderMixin2['default']],

  propTypes: {
    modifier: _react2['default'].PropTypes.string
  },

  render: function render() {
    var modifier = this.props.modifier;

    var modifiers = _defineProperty({}, modifier, true);
    var states = {};

    return _react2['default'].createElement('div', { className: this.cx({ states: states, modifiers: modifiers }) });
  }
});

exports['default'] = CalendarHighlight;
module.exports = exports['default'];