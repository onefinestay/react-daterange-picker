'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _momentRange = require('moment-range');

var _momentRange2 = _interopRequireDefault(_momentRange);

var _calendar = require('calendar');

var _calendar2 = _interopRequireDefault(_calendar);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utilsBemMixin = require('../utils/BemMixin');

var _utilsBemMixin2 = _interopRequireDefault(_utilsBemMixin);

var _utilsCustomPropTypes = require('../utils/CustomPropTypes');

var _utilsCustomPropTypes2 = _interopRequireDefault(_utilsCustomPropTypes);

var _utilsIsMomentRange = require('../utils/isMomentRange');

var _utilsIsMomentRange2 = _interopRequireDefault(_utilsIsMomentRange);

var _utilsPureRenderMixin = require('../utils/PureRenderMixin');

var _utilsPureRenderMixin2 = _interopRequireDefault(_utilsPureRenderMixin);

var lang = (0, _momentRange2['default'])().localeData();

var WEEKDAYS = _immutable2['default'].List(lang._weekdays).zip(_immutable2['default'].List(lang._weekdaysShort));
var MONTHS = _immutable2['default'].List(lang._months);

var CalendarMonth = _reactAddons2['default'].createClass({
  displayName: 'CalendarMonth',

  mixins: [_utilsBemMixin2['default'], _utilsPureRenderMixin2['default']],

  propTypes: {
    dateComponent: _reactAddons2['default'].PropTypes.func,
    disableNavigation: _reactAddons2['default'].PropTypes.bool,
    enabledRange: _utilsCustomPropTypes2['default'].momentRange,
    firstOfMonth: _utilsCustomPropTypes2['default'].moment,
    firstOfWeek: _reactAddons2['default'].PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    hideSelection: _reactAddons2['default'].PropTypes.bool,
    highlightedDate: _reactAddons2['default'].PropTypes.object,
    highlightedRange: _reactAddons2['default'].PropTypes.object,
    onMonthChange: _reactAddons2['default'].PropTypes.func,
    onYearChange: _reactAddons2['default'].PropTypes.func,
    value: _utilsCustomPropTypes2['default'].momentOrMomentRange },

  renderDay: function renderDay(date, i) {
    var _props = this.props;
    var CalendarDate = _props.dateComponent;
    var value = _props.value;
    var highlightedDate = _props.highlightedDate;
    var highlightedRange = _props.highlightedRange;
    var hideSelection = _props.hideSelection;
    var enabledRange = _props.enabledRange;

    var props = _objectWithoutProperties(_props, ['dateComponent', 'value', 'highlightedDate', 'highlightedRange', 'hideSelection', 'enabledRange']);

    var d = (0, _momentRange2['default'])(date);

    var isInSelectedRange = undefined;
    var isSelectedDate = undefined;
    var isSelectedRangeStart = undefined;
    var isSelectedRangeEnd = undefined;

    if (!hideSelection && value && _momentRange2['default'].isMoment(value) && value.isSame(d)) {
      isSelectedDate = true;
    } else if (!hideSelection && value && (0, _utilsIsMomentRange2['default'])(value) && value.contains(d)) {
      isInSelectedRange = true;

      isSelectedRangeStart = value.start.isSame(d);
      isSelectedRangeEnd = value.end.isSame(d);
    }

    return _reactAddons2['default'].createElement(CalendarDate, _extends({
      key: i,
      isDisabled: !enabledRange.contains(d),
      isHighlightedDate: !!(highlightedDate && highlightedDate.isSame(d)),
      isHighlightedRangeStart: !!(highlightedRange && highlightedRange.start.isSame(d)),
      isHighlightedRangeEnd: !!(highlightedRange && highlightedRange.end.isSame(d)),
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
    return _reactAddons2['default'].createElement(
      'tr',
      { className: this.cx({ element: 'Week' }), key: i },
      days.toJS()
    );
  },

  renderDayHeaders: function renderDayHeaders() {
    var firstOfWeek = this.props.firstOfWeek;

    var indices = _immutable2['default'].Range(firstOfWeek, 7).concat(_immutable2['default'].Range(0, firstOfWeek));

    var headers = indices.map((function (index) {
      var weekday = WEEKDAYS.get(index);
      return _reactAddons2['default'].createElement(
        'th',
        { className: this.cx({ element: 'WeekdayHeading' }), key: weekday, scope: 'col' },
        _reactAddons2['default'].createElement(
          'abbr',
          { title: weekday[0] },
          weekday[1]
        )
      );
    }).bind(this));

    return _reactAddons2['default'].createElement(
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

    return _reactAddons2['default'].createElement(
      'option',
      { key: year, value: year },
      year
    );
  },

  renderHeaderYear: function renderHeaderYear() {
    var firstOfMonth = this.props.firstOfMonth;

    var y = firstOfMonth.year();
    var years = _immutable2['default'].Range(y - 5, y).concat(_immutable2['default'].Range(y, y + 10));
    var choices = years.map(this.renderYearChoice);
    var modifiers = { year: true };

    return _reactAddons2['default'].createElement(
      'span',
      { className: this.cx({ element: 'MonthHeaderLabel', modifiers: modifiers }) },
      firstOfMonth.format('YYYY'),
      this.props.disableNavigation ? null : _reactAddons2['default'].createElement(
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
    var _props2 = this.props;
    var firstOfMonth = _props2.firstOfMonth;
    var enabledRange = _props2.enabledRange;

    var disabled = false;
    var year = firstOfMonth.year();

    if ((0, _momentRange2['default'])({ years: year, months: i + 1, date: 1 }).unix() < enabledRange.start.unix()) {
      disabled = true;
    }

    if ((0, _momentRange2['default'])({ years: year, months: i, date: 1 }).unix() > enabledRange.end.unix()) {
      disabled = true;
    }

    return _reactAddons2['default'].createElement(
      'option',
      { key: month, value: i, disabled: disabled ? 'disabled' : null },
      month
    );
  },

  renderHeaderMonth: function renderHeaderMonth() {
    var firstOfMonth = this.props.firstOfMonth;

    var choices = MONTHS.map(this.renderMonthChoice);
    var modifiers = { month: true };

    return _reactAddons2['default'].createElement(
      'span',
      { className: this.cx({ element: 'MonthHeaderLabel', modifiers: modifiers }) },
      firstOfMonth.format('MMMM'),
      this.props.disableNavigation ? null : _reactAddons2['default'].createElement(
        'select',
        { className: this.cx({ element: 'MonthHeaderSelect' }), value: firstOfMonth.month(), onChange: this.handleMonthChange },
        choices.toJS()
      )
    );
  },

  renderHeader: function renderHeader() {
    return _reactAddons2['default'].createElement(
      'div',
      { className: this.cx({ element: 'MonthHeader' }) },
      this.renderHeaderMonth(),
      ' ',
      this.renderHeaderYear()
    );
  },

  render: function render() {
    var _props3 = this.props;
    var firstOfWeek = _props3.firstOfWeek;
    var firstOfMonth = _props3.firstOfMonth;

    var cal = new _calendar2['default'].Calendar(firstOfWeek);
    var monthDates = _immutable2['default'].fromJS(cal.monthDates(firstOfMonth.year(), firstOfMonth.month()));
    var weeks = monthDates.map(this.renderWeek);

    return _reactAddons2['default'].createElement(
      'div',
      { className: this.cx({ element: 'Month' }) },
      this.renderHeader(),
      _reactAddons2['default'].createElement(
        'table',
        { className: this.cx({ element: 'MonthDates' }) },
        _reactAddons2['default'].createElement(
          'thead',
          null,
          this.renderDayHeaders()
        ),
        _reactAddons2['default'].createElement(
          'tbody',
          null,
          weeks.toJS()
        )
      )
    );
  } });

exports['default'] = CalendarMonth;
module.exports = exports['default'];