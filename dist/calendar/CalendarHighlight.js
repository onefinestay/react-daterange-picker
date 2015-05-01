'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _React = require('react/addons');

var _React2 = _interopRequireDefault(_React);

var _BemMixin = require('../utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

'use strict';

var PureRenderMixin = _React2['default'].addons.PureRenderMixin;

var CalendarHighlight = _React2['default'].createClass({
  displayName: 'CalendarHighlight',

  mixins: [_BemMixin2['default'], PureRenderMixin],

  render: function render() {
    var _props = this.props;
    var modifier = _props.modifier;
    var inOtherMonth = _props.inOtherMonth;

    var modifiers = _defineProperty({}, modifier, true);
    var states = {
      inOtherMonth: inOtherMonth
    };

    return _React2['default'].createElement('div', { className: this.cx({ states: states, modifiers: modifiers }) });
  }
});

exports['default'] = CalendarHighlight;
module.exports = exports['default'];