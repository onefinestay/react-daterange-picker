'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _utilsBemMixin = require('../utils/BemMixin');

var _utilsBemMixin2 = _interopRequireDefault(_utilsBemMixin);

'use strict';

var PureRenderMixin = _reactAddons2['default'].addons.PureRenderMixin;

var CalendarSelection = _reactAddons2['default'].createClass({
  displayName: 'CalendarSelection',

  mixins: [_utilsBemMixin2['default'], PureRenderMixin],

  render: function render() {
    var _props = this.props;
    var modifier = _props.modifier;
    var inOtherMonth = _props.inOtherMonth;
    var newSelectionStarted = _props.newSelectionStarted;
    var pending = _props.pending;

    var modifiers = _defineProperty({}, modifier, true);
    var states = {
      pending: pending,
      newSelectionStarted: newSelectionStarted,
      inOtherMonth: inOtherMonth
    };

    return _reactAddons2['default'].createElement('div', { className: this.cx({ states: states, modifiers: modifiers }) });
  }
});

exports['default'] = CalendarSelection;
module.exports = exports['default'];