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

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _BemMixin = require('../utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

var _CustomPropTypes = require('../utils/CustomPropTypes');

var _CustomPropTypes2 = _interopRequireDefault(_CustomPropTypes);

var _PureRenderMixin = require('../utils/PureRenderMixin');

var _PureRenderMixin2 = _interopRequireDefault(_PureRenderMixin);

var _lightenDarkenColor = require('../utils/lightenDarkenColor');

var _lightenDarkenColor2 = _interopRequireDefault(_lightenDarkenColor);

var _CalendarDatePeriod = require('./CalendarDatePeriod');

var _CalendarDatePeriod2 = _interopRequireDefault(_CalendarDatePeriod);

var _CalendarHighlight = require('./CalendarHighlight');

var _CalendarHighlight2 = _interopRequireDefault(_CalendarHighlight);

var _CalendarSelection = require('./CalendarSelection');

var _CalendarSelection2 = _interopRequireDefault(_CalendarSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CalendarDate = (0, _createReactClass2.default)({
  mixins: [_BemMixin2.default, _PureRenderMixin2.default],
  displayName: "CalendarDate",

  propTypes: {
    date: _CustomPropTypes2.default.moment,

    renderDate: _react2.default.PropTypes.func,

    firstOfMonth: _react2.default.PropTypes.object.isRequired,

    isSelectedDate: _propTypes2.default.bool,
    isSelectedRangeStart: _propTypes2.default.bool,
    isSelectedRangeEnd: _propTypes2.default.bool,
    isInSelectedRange: _propTypes2.default.bool,

    isHighlightedDate: _propTypes2.default.bool,
    isHighlightedRangeStart: _propTypes2.default.bool,
    isHighlightedRangeEnd: _propTypes2.default.bool,
    isInHighlightedRange: _propTypes2.default.bool,

    fullDayStates: _react2.default.PropTypes.bool,
    highlightedDate: _react2.default.PropTypes.object,
    dateStates: _react2.default.PropTypes.instanceOf(_immutable2.default.List),
    isDisabled: _react2.default.PropTypes.bool,
    isToday: _react2.default.PropTypes.bool,

    dateRangesForDate: _propTypes2.default.func,
    onHighlightDate: _propTypes2.default.func,
    onUnHighlightDate: _propTypes2.default.func,
    onSelectDate: _propTypes2.default.func
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
    this.props.onSelectDate(this.props.date);

    if (this.isUnmounted) {
      return;
    }

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
    event.preventDefault();
    this.props.onHighlightDate(this.props.date);
    this.props.onSelectDate(this.props.date);

    if (this.isUnmounted) {
      return;
    }

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
    var _props = this.props,
        date = _props.date,
        firstOfMonth = _props.firstOfMonth,
        today = _props.isToday;


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
    var _props2 = this.props,
        isSelectedDate = _props2.isSelectedDate,
        isInSelectedRange = _props2.isInSelectedRange,
        isInHighlightedRange = _props2.isInHighlightedRange,
        highlighted = _props2.isHighlightedDate,
        disabled = _props2.isDisabled;


    var selected = isSelectedDate || isInSelectedRange || isInHighlightedRange;

    return { disabled: disabled, highlighted: highlighted, selected: selected };
  },
  renderDate: function renderDate(date) {
    var renderDate = this.props.renderDate;


    return renderDate ? renderDate(date) : date.format('D');
  },
  render: function render() {
    var _props3 = this.props,
        date = _props3.date,
        dateRangesForDate = _props3.dateRangesForDate,
        isSelectedDate = _props3.isSelectedDate,
        isSelectedRangeStart = _props3.isSelectedRangeStart,
        isSelectedRangeEnd = _props3.isSelectedRangeEnd,
        isInSelectedRange = _props3.isInSelectedRange,
        isHighlightedDate = _props3.isHighlightedDate,
        isHighlightedRangeStart = _props3.isHighlightedRangeStart,
        isHighlightedRangeEnd = _props3.isHighlightedRangeEnd,
        isInHighlightedRange = _props3.isInHighlightedRange;


    var bemModifiers = this.getBemModifiers();
    var bemStates = this.getBemStates();
    var pending = isInHighlightedRange;

    var color = void 0;
    var amColor = void 0;
    var pmColor = void 0;
    var states = dateRangesForDate(date);
    var numStates = states.count();
    var cellStyle = {};
    var style = {};

    var highlightModifier = void 0;
    var selectionModifier = void 0;

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

    if (this.props.fullDayStates || numStates === 1) {
      // If there's only one state, it means we're not at a boundary
      color = states.getIn([0, 'color']);

      if (color) {
        if (!states.getIn([0, 'selectable'])) {
          bemStates[states.getIn([0, 'state'])] = true;
        }
        style = {
          backgroundColor: color
        };
        cellStyle = {
          borderLeftColor: (0, _lightenDarkenColor2.default)(color, -10),
          borderRightColor: (0, _lightenDarkenColor2.default)(color, -10)
        };
      }
    } else {
      amColor = states.getIn([0, 'color']);
      pmColor = states.getIn([1, 'color']);

      if (amColor) {
        cellStyle.borderLeftColor = (0, _lightenDarkenColor2.default)(amColor, -10);
      }

      if (pmColor) {
        cellStyle.borderRightColor = (0, _lightenDarkenColor2.default)(pmColor, -10);
      }
    }

    return _react2.default.createElement(
      'td',
      { className: this.cx({ element: 'Date', modifiers: bemModifiers, states: bemStates }),
        style: cellStyle,
        onTouchStart: this.touchStart,
        onMouseEnter: this.mouseEnter,
        onMouseLeave: this.mouseLeave,
        onMouseDown: this.mouseDown },
      numStates > 1 && !this.props.fullDayStates && _react2.default.createElement(
        'div',
        { className: this.cx({ element: "HalfDateStates" }) },
        _react2.default.createElement(_CalendarDatePeriod2.default, { period: 'am', color: amColor }),
        _react2.default.createElement(_CalendarDatePeriod2.default, { period: 'pm', color: pmColor })
      ),
      numStates === 1 && _react2.default.createElement('div', { className: this.cx({ element: "FullDateStates" }), style: style }),
      _react2.default.createElement(
        'span',
        { className: this.cx({ element: "DateLabel" }) },
        this.renderDate(date)
      ),
      selectionModifier ? _react2.default.createElement(_CalendarSelection2.default, { modifier: selectionModifier, pending: pending }) : null,
      highlightModifier ? _react2.default.createElement(_CalendarHighlight2.default, { modifier: highlightModifier }) : null
    );
  }
});

exports.default = CalendarDate;