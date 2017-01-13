'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

var _calendar = require('calendar');

var _calendar2 = _interopRequireDefault(_calendar);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _BemMixin = require('../utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

var _CustomPropTypes = require('../utils/CustomPropTypes');

var _CustomPropTypes2 = _interopRequireDefault(_CustomPropTypes);

var _isMomentRange = require('../utils/isMomentRange');

var _isMomentRange2 = _interopRequireDefault(_isMomentRange);

var _PureRenderMixin = require('../utils/PureRenderMixin');

var _PureRenderMixin2 = _interopRequireDefault(_PureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var CalendarMonth = _react2.default.createClass({
  displayName: 'CalendarMonth',

  mixins: [_BemMixin2.default, _PureRenderMixin2.default],

  propTypes: {
    dateComponent: _react2.default.PropTypes.func,
    disableNavigation: _react2.default.PropTypes.bool,
    enabledRange: _CustomPropTypes2.default.momentRange,
    firstOfMonth: _CustomPropTypes2.default.moment,
    firstOfWeek: _react2.default.PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    hideSelection: _react2.default.PropTypes.bool,
    highlightedDate: _react2.default.PropTypes.object,
    highlightedRange: _react2.default.PropTypes.object,
    onMonthChange: _react2.default.PropTypes.func,
    onYearChange: _react2.default.PropTypes.func,
    value: _CustomPropTypes2.default.momentOrMomentRange,
    locale: _react2.default.PropTypes.string
  },

  setLocale: function setLocale(locale) {
    _moment2.default.locale(locale);
    this.WEEKDAYS = _immutable2.default.List(_moment2.default.weekdays()).zip(_immutable2.default.List(_moment2.default.weekdaysShort()));
    this.MONTHS = _immutable2.default.List(_moment2.default.months());
  },
  componentWillMount: function componentWillMount() {
    var locale = this.props.locale;

    this.setLocale(locale);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var locale = nextProps.locale;

    if (locale !== this.props.locale) {
      this.setLocale(locale);
    }
  },
  renderDay: function renderDay(date, i) {
    var _props = this.props,
        CalendarDate = _props.dateComponent,
        value = _props.value,
        highlightedDate = _props.highlightedDate,
        highlightedRange = _props.highlightedRange,
        hideSelection = _props.hideSelection,
        enabledRange = _props.enabledRange,
        props = _objectWithoutProperties(_props, ['dateComponent', 'value', 'highlightedDate', 'highlightedRange', 'hideSelection', 'enabledRange']);

    var d = (0, _moment2.default)(date).locale(this.props.locale);

    var isInSelectedRange = void 0;
    var isSelectedDate = void 0;
    var isSelectedRangeStart = void 0;
    var isSelectedRangeEnd = void 0;

    if (!hideSelection && value && _moment2.default.isMoment(value) && value.isSame(d, 'day')) {
      isSelectedDate = true;
    } else if (!hideSelection && value && (0, _isMomentRange2.default)(value) && value.contains(d)) {
      isInSelectedRange = true;

      isSelectedRangeStart = value.start.isSame(d, 'day');
      isSelectedRangeEnd = value.end.isSame(d, 'day');
    }

    return _react2.default.createElement(CalendarDate, _extends({
      key: i,
      isToday: d.isSame((0, _moment2.default)(), 'day'),
      isDisabled: !enabledRange.contains(d),
      isHighlightedDate: !!(highlightedDate && highlightedDate.isSame(d, 'day')),
      isHighlightedRangeStart: !!(highlightedRange && highlightedRange.start.isSame(d, 'day')),
      isHighlightedRangeEnd: !!(highlightedRange && highlightedRange.end.isSame(d, 'day')),
      isInHighlightedRange: !!(highlightedRange && highlightedRange.contains(d)),
      isSelectedDate: isSelectedDate,
      isSelectedRangeStart: isSelectedRangeStart,
      isSelectedRangeEnd: isSelectedRangeEnd,
      isInSelectedRange: isInSelectedRange,
      date: d
    }, props));
  },
  renderWeek: function renderWeek(dates, i) {
    var days = dates.map(this.renderDay);
    return _react2.default.createElement(
      'tr',
      { className: this.cx({ element: 'Week' }), key: i },
      days.toJS()
    );
  },
  renderDayHeaders: function renderDayHeaders() {
    var firstOfWeek = this.props.firstOfWeek;

    var indices = _immutable2.default.Range(firstOfWeek, 7).concat(_immutable2.default.Range(0, firstOfWeek));

    var headers = indices.map(function (index) {
      var weekday = this.WEEKDAYS.get(index);
      return _react2.default.createElement(
        'th',
        { className: this.cx({ element: 'WeekdayHeading' }), key: weekday, scope: 'col' },
        _react2.default.createElement(
          'abbr',
          { title: weekday[0] },
          weekday[1]
        )
      );
    }.bind(this));

    return _react2.default.createElement(
      'tr',
      { className: this.cx({ element: 'Weekdays' }) },
      headers.toJS()
    );
  },
  handleYearChange: function handleYearChange(event) {
    this.props.onYearChange(parseInt(event.target.value, 10));
  },
  renderYearChoice: function renderYearChoice(year) {
    var enabledRange = this.props.enabledRange;


    if (year < enabledRange.start.year()) {
      return null;
    }

    if (year > enabledRange.end.year()) {
      return null;
    }

    return _react2.default.createElement(
      'option',
      { key: year, value: year },
      (0, _moment2.default)(year, 'YYYY').locale(this.props.locale).format('YYYY')
    );
  },
  renderHeaderYear: function renderHeaderYear() {
    var firstOfMonth = this.props.firstOfMonth;

    var y = firstOfMonth.year();
    var years = _immutable2.default.Range(y - 5, y).concat(_immutable2.default.Range(y, y + 10));
    var choices = years.map(this.renderYearChoice);
    var modifiers = { year: true };
    return _react2.default.createElement(
      'span',
      { className: this.cx({ element: 'MonthHeaderLabel', modifiers: modifiers }) },
      firstOfMonth.locale(this.props.locale).format('YYYY'),
      this.props.disableNavigation ? null : _react2.default.createElement(
        'select',
        { className: this.cx({ element: 'MonthHeaderSelect' }), value: y, onChange: this.handleYearChange },
        choices.toJS()
      )
    );
  },
  handleMonthChange: function handleMonthChange(event) {
    this.props.onMonthChange(parseInt(event.target.value, 10));
  },
  renderMonthChoice: function renderMonthChoice(month, i) {
    var _props2 = this.props,
        firstOfMonth = _props2.firstOfMonth,
        enabledRange = _props2.enabledRange;

    var disabled = false;
    var year = firstOfMonth.year();

    if ((0, _moment2.default)({ years: year, months: i + 1, date: 1 }).unix() < enabledRange.start.unix()) {
      disabled = true;
    }

    if ((0, _moment2.default)({ years: year, months: i, date: 1 }).unix() > enabledRange.end.unix()) {
      disabled = true;
    }

    return _react2.default.createElement(
      'option',
      { key: month, value: i, disabled: disabled ? 'disabled' : null },
      month
    );
  },
  renderHeaderMonth: function renderHeaderMonth() {
    var firstOfMonth = this.props.firstOfMonth;

    var choices = this.MONTHS.map(this.renderMonthChoice);
    var modifiers = { month: true };

    return _react2.default.createElement(
      'span',
      { className: this.cx({ element: 'MonthHeaderLabel', modifiers: modifiers }) },
      firstOfMonth.locale(this.props.locale).format('MMMM'),
      this.props.disableNavigation ? null : _react2.default.createElement(
        'select',
        { className: this.cx({ element: 'MonthHeaderSelect' }), value: firstOfMonth.month(), onChange: this.handleMonthChange },
        choices.toJS()
      )
    );
  },
  renderHeader: function renderHeader() {
    return _react2.default.createElement(
      'div',
      { className: this.cx({ element: 'MonthHeader' }) },
      this.renderHeaderMonth(),
      ' ',
      this.renderHeaderYear()
    );
  },
  render: function render() {
    var _props3 = this.props,
        firstOfWeek = _props3.firstOfWeek,
        firstOfMonth = _props3.firstOfMonth;


    var cal = new _calendar2.default.Calendar(firstOfWeek);
    var monthDates = _immutable2.default.fromJS(cal.monthDates(firstOfMonth.year(), firstOfMonth.month()));
    var weeks = monthDates.map(this.renderWeek);

    return _react2.default.createElement(
      'div',
      { className: this.cx({ element: 'Month' }) },
      this.renderHeader(),
      _react2.default.createElement(
        'table',
        { className: this.cx({ element: 'MonthDates' }) },
        _react2.default.createElement(
          'thead',
          null,
          this.renderDayHeaders()
        ),
        _react2.default.createElement(
          'tbody',
          null,
          weeks.toJS()
        )
      )
    );
  }
});

exports.default = CalendarMonth;