'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _BemMixin = require('../utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

var _PureRenderMixin = require('../utils/PureRenderMixin');

var _PureRenderMixin2 = _interopRequireDefault(_PureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CalendarHighlight = (0, _createReactClass2.default)({
  mixins: [_BemMixin2.default, _PureRenderMixin2.default],
  displayName: "CalendarHighlight",

  propTypes: {
    modifier: _propTypes2.default.string
  },

  render: function render() {
    var modifier = this.props.modifier;

    var modifiers = _defineProperty({}, modifier, true);
    var states = {};

    return _react2.default.createElement('div', { className: this.cx({ states: states, modifiers: modifiers }) });
  }
});

exports.default = CalendarHighlight;