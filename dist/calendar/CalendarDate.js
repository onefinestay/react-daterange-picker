'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

var CalendarDate = _react2['default'].createClass({
  displayName: 'CalendarDate',

  mixins: [_utilsBemMixin2['default'], _utilsPureRenderMixin2['default']],

  propTypes: {
    date: _utilsCustomPropTypes2['default'].moment,

    firstOfMonth: _react2['default'].PropTypes.object.isRequired,

    isSelectedDate: _react2['default'].PropTypes.bool,
    isSelectedRangeStart: _react2['default'].PropTypes.bool,
    isSelectedRangeEnd: _react2['default'].PropTypes.bool,
    isInSelectedRange: _react2['default'].PropTypes.bool,

    isHighlightedDate: _react2['default'].PropTypes.bool,
    isHighlightedRangeStart: _react2['default'].PropTypes.bool,
    isHighlightedRangeEnd: _react2['default'].PropTypes.bool,
    isInHighlightedRange: _react2['default'].PropTypes.bool,

    highlightedDate: _react2['default'].PropTypes.object,
    dateStates: _react2['default'].PropTypes.instanceOf(_immutable2['default'].List),
    isDisabled: _react2['default'].PropTypes.bool,
    isToday: _react2['default'].PropTypes.bool,

    dateRangesForDate: _react2['default'].PropTypes.func,
    onHighlightDate: _react2['default'].PropTypes.func,
    onUnHighlightDate: _react2['default'].PropTypes.func,
    onSelectDate: _react2['default'].PropTypes.func
  },

  getInitialState: function getInitialState() {
    return {
      mouseDown: false
    };
  },

  componentWillUnmount: function componentWillUnmount() {
    this.isUnmounted = true;
    document.removeEventListener('mouseup', this.mouseUp);
    document.removeEventListener('touchend', this.touchEnd);
  },

  mouseUp: function mouseUp() {
    if (this.isUnmounted) {
      return;
    }

    this.props.onSelectDate(this.props.date);
    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false
      });
    }

    document.removeEventListener('mouseup', this.mouseUp);
  },

  mouseDown: function mouseDown() {
    this.setState({
      mouseDown: true
    });

    document.addEventListener('mouseup', this.mouseUp);
  },

  touchEnd: function touchEnd() {
    if (this.isUnmounted) {
      return;
    }

    this.props.onHighlightDate(this.props.date);
    this.props.onSelectDate(this.props.date);

    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false
      });
    }
    document.removeEventListener('touchend', this.touchEnd);
  },

  touchStart: function touchStart(event) {
    event.preventDefault();
    this.setState({
      mouseDown: true
    });
    document.addEventListener('touchend', this.touchEnd);
  },

  mouseEnter: function mouseEnter() {
    this.props.onHighlightDate(this.props.date);
  },

  mouseLeave: function mouseLeave() {
    if (this.state.mouseDown) {
      this.props.onSelectDate(this.props.date);

      this.setState({
        mouseDown: false
      });
    }
    this.props.onUnHighlightDate(this.props.date);
  },

  getBemModifiers: function getBemModifiers() {
    var _props = this.props;
    var date = _props.date;
    var firstOfMonth = _props.firstOfMonth;
    var today = _props.isToday;

    var otherMonth = false;
    var weekend = false;

    if (date.month() !== firstOfMonth.month()) {
      otherMonth = true;
    }

    if (date.day() === 0 || date.day() === 6) {
      weekend = true;
    }

    return { today: today, weekend: weekend, otherMonth: otherMonth };
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
          backgroundColor: color
        };
        cellStyle = {
          borderLeftColor: (0, _utilsLightenDarkenColor2['default'])(color, -10),
          borderRightColor: (0, _utilsLightenDarkenColor2['default'])(color, -10)
        };
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

    return _react2['default'].createElement(
      'td',
      { className: this.cx({ element: 'Date', modifiers: bemModifiers, states: bemStates }),
        style: cellStyle,
        onTouchStart: this.touchStart,
        onMouseEnter: this.mouseEnter,
        onMouseLeave: this.mouseLeave,
        onMouseDown: this.mouseDown },
      numStates > 1 && _react2['default'].createElement(
        'div',
        { className: this.cx({ element: "HalfDateStates" }) },
        _react2['default'].createElement(_CalendarDatePeriod2['default'], { period: 'am', color: amColor }),
        _react2['default'].createElement(_CalendarDatePeriod2['default'], { period: 'pm', color: pmColor })
      ),
      numStates === 1 && _react2['default'].createElement('div', { className: this.cx({ element: "FullDateStates" }), style: style }),
      _react2['default'].createElement(
        'span',
        { className: this.cx({ element: "DateLabel" }) },
        date.format('D')
      ),
      selectionModifier ? _react2['default'].createElement(_CalendarSelection2['default'], { modifier: selectionModifier, pending: pending }) : null,
      highlightModifier ? _react2['default'].createElement(_CalendarHighlight2['default'], { modifier: highlightModifier }) : null
    );
  }
});

exports['default'] = CalendarDate;
module.exports = exports['default'];