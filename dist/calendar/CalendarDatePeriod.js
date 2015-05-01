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

var CalendarDatePeriod = _React2['default'].createClass({
  displayName: 'CalendarDatePeriod',

  mixins: [_BemMixin2['default'], PureRenderMixin],

  render: function render() {
    var _props = this.props;
    var color = _props.color;
    var period = _props.period;

    var modifiers = _defineProperty({}, period, true);
    var style;

    if (color) {
      style = { backgroundColor: color };
    }

    return _React2['default'].createElement('div', { style: style, className: this.cx({ modifiers: modifiers }) });
  }
});

exports['default'] = CalendarDatePeriod;
module.exports = exports['default'];