'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utilsBemMixin = require('../utils/BemMixin');

var _utilsBemMixin2 = _interopRequireDefault(_utilsBemMixin);

var _utilsCustomPropTypes = require('../utils/CustomPropTypes');

var _utilsCustomPropTypes2 = _interopRequireDefault(_utilsCustomPropTypes);

var _utilsPureRenderMixin = require('../utils/PureRenderMixin');

var _utilsPureRenderMixin2 = _interopRequireDefault(_utilsPureRenderMixin);

var _utilsLightenDarkenColor = require('../utils/lightenDarkenColor');

var _utilsLightenDarkenColor2 = _interopRequireDefault(_utilsLightenDarkenColor);

var _CalendarDatePeriod = require('./CalendarDatePeriod');

var _CalendarDatePeriod2 = _interopRequireDefault(_CalendarDatePeriod);

var _CalendarHighlight = require('./CalendarHighlight');

var _CalendarHighlight2 = _interopRequireDefault(_CalendarHighlight);

var _CalendarSelection = require('./CalendarSelection');

var _CalendarSelection2 = _interopRequireDefault(_CalendarSelection);

var CalendarDate = _reactAddons2['default'].createClass({
  displayName: 'CalendarDate',

  mixins: [_utilsBemMixin2['default'], _utilsPureRenderMixin2['default']],

  propTypes: {
    date: _utilsCustomPropTypes2['default'].moment,

    firstOfMonth: _reactAddons2['default'].PropTypes.object.isRequired,

    isSelectedDate: _reactAddons2['default'].PropTypes.bool,
    isSelectedRangeStart: _reactAddons2['default'].PropTypes.bool,
    isSelectedRangeEnd: _reactAddons2['default'].PropTypes.bool,
    isInSelectedRange: _reactAddons2['default'].PropTypes.bool,

    isHighlightedDate: _reactAddons2['default'].PropTypes.bool,
    isHighlightedRangeStart: _reactAddons2['default'].PropTypes.bool,
    isHighlightedRangeEnd: _reactAddons2['default'].PropTypes.bool,
    isInHighlightedRange: _reactAddons2['default'].PropTypes.bool,

    highlightedDate: _reactAddons2['default'].PropTypes.object,
    dateStates: _reactAddons2['default'].PropTypes.instanceOf(_immutable2['default'].List),
    isDisabled: _reactAddons2['default'].PropTypes.bool,

    dateRangesForDate: _reactAddons2['default'].PropTypes.func,
    onHighlightDate: _reactAddons2['default'].PropTypes.func,
    onUnHighlightDate: _reactAddons2['default'].PropTypes.func,
    onSelectDate: _reactAddons2['default'].PropTypes.func },

  getInitialState: function getInitialState() {
    return {
      mouseDown: false };
  },

  mouseUp: function mouseUp() {
    this.props.onSelectDate(this.props.date);

    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false });
    }
    document.removeEventListener('mouseup', this.mouseUp);
  },

  mouseDown: function mouseDown() {
    this.setState({
      mouseDown: true });
    document.addEventListener('mouseup', this.mouseUp);
  },

  touchEnd: function touchEnd() {
    this.props.onHighlightDate(this.props.date);
    this.props.onSelectDate(this.props.date);

    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false });
    }
    document.removeEventListener('touchend', this.touchEnd);
  },

  touchStart: function touchStart(event) {
    event.preventDefault();
    this.setState({
      mouseDown: true });
    document.addEventListener('touchend', this.touchEnd);
  },

  mouseEnter: function mouseEnter() {
    this.props.onHighlightDate(this.props.date);
  },

  mouseLeave: function mouseLeave() {
    if (this.state.mouseDown) {
      this.props.onSelectDate(this.props.date);

      this.setState({
        mouseDown: false });
    }
    this.props.onUnHighlightDate(this.props.date);
  },

  getBemModifiers: function getBemModifiers() {
    var _props = this.props;
    var date = _props.date;
    var firstOfMonth = _props.firstOfMonth;

    var otherMonth = false;
    var weekend = false;

    if (date.month() !== firstOfMonth.month()) {
      otherMonth = true;
    }

    if (date.day() === 0 || date.day() === 6) {
      weekend = true;
    }

    return { weekend: weekend, otherMonth: otherMonth };
  },

  getBemStates: function getBemStates() {
    var _props2 = this.props;
    var isSelectedDate = _props2.isSelectedDate;
    var isInSelectedRange = _props2.isInSelectedRange;
    var isInHighlightedRange = _props2.isInHighlightedRange;
    var highlighted = _props2.isHighlightedDate;
    var disabled = _props2.isDisabled;

    var selected = isSelectedDate || isInSelectedRange || isInHighlightedRange;

    return { disabled: disabled, highlighted: highlighted, selected: selected };
  },

  render: function render() {
    var _props3 = this.props;
    var date = _props3.date;
    var dateRangesForDate = _props3.dateRangesForDate;
    var isSelectedDate = _props3.isSelectedDate;
    var isSelectedRangeStart = _props3.isSelectedRangeStart;
    var isSelectedRangeEnd = _props3.isSelectedRangeEnd;
    var isInSelectedRange = _props3.isInSelectedRange;
    var isHighlightedDate = _props3.isHighlightedDate;
    var isHighlightedRangeStart = _props3.isHighlightedRangeStart;
    var isHighlightedRangeEnd = _props3.isHighlightedRangeEnd;
    var isInHighlightedRange = _props3.isInHighlightedRange;

    var bemModifiers = this.getBemModifiers();
    var bemStates = this.getBemStates();
    var pending = isInHighlightedRange;

    var color = undefined;
    var amColor = undefined;
    var pmColor = undefined;
    var states = dateRangesForDate(date);
    var numStates = states.count();
    var cellStyle = {};
    var style = {};

    var highlightModifier = undefined;
    var selectionModifier = undefined;

    if (isSelectedDate || isSelectedRangeStart && isSelectedRangeEnd || isHighlightedRangeStart && isHighlightedRangeEnd) {
      selectionModifier = 'single';
    } else if (isSelectedRangeStart || isHighlightedRangeStart) {
      selectionModifier = 'start';
    } else if (isSelectedRangeEnd || isHighlightedRangeEnd) {
      selectionModifier = 'end';
    } else if (isInSelectedRange || isInHighlightedRange) {
      selectionModifier = 'segment';
    }

    if (isHighlightedDate) {
      highlightModifier = 'single';
    }

    if (numStates === 1) {
      // If there's only one state, it means we're not at a boundary
      color = states.getIn([0, 'color']);

      if (color) {

        style = {
          backgroundColor: color };
        cellStyle = {
          borderLeftColor: (0, _utilsLightenDarkenColor2['default'])(color, -10),
          borderRightColor: (0, _utilsLightenDarkenColor2['default'])(color, -10) };
      }
    } else {
      amColor = states.getIn([0, 'color']);
      pmColor = states.getIn([1, 'color']);

      if (amColor) {
        cellStyle.borderLeftColor = (0, _utilsLightenDarkenColor2['default'])(amColor, -10);
      }

      if (pmColor) {
        cellStyle.borderRightColor = (0, _utilsLightenDarkenColor2['default'])(pmColor, -10);
      }
    }

    return _reactAddons2['default'].createElement(
      'td',
      { className: this.cx({ element: 'Date', modifiers: bemModifiers, states: bemStates }),
        style: cellStyle,
        onTouchStart: this.touchStart,
        onMouseEnter: this.mouseEnter,
        onMouseLeave: this.mouseLeave,
        onMouseDown: this.mouseDown },
      numStates > 1 && _reactAddons2['default'].createElement(
        'div',
        { className: this.cx({ element: 'HalfDateStates' }) },
        _reactAddons2['default'].createElement(_CalendarDatePeriod2['default'], { period: 'am', color: amColor }),
        _reactAddons2['default'].createElement(_CalendarDatePeriod2['default'], { period: 'pm', color: pmColor })
      ),
      numStates === 1 && _reactAddons2['default'].createElement('div', { className: this.cx({ element: 'FullDateStates' }), style: style }),
      _reactAddons2['default'].createElement(
        'span',
        { className: this.cx({ element: 'DateLabel' }) },
        date.format('D')
      ),
      selectionModifier ? _reactAddons2['default'].createElement(_CalendarSelection2['default'], { modifier: selectionModifier, pending: pending }) : null,
      highlightModifier ? _reactAddons2['default'].createElement(_CalendarHighlight2['default'], { modifier: highlightModifier }) : null
    );
  } });

exports['default'] = CalendarDate;
module.exports = exports['default'];