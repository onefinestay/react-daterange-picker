'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _React = require('react/addons');

var _React2 = _interopRequireDefault(_React);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _calendar = require('calendar');

var _calendar2 = _interopRequireDefault(_calendar);

var _Immutable = require('immutable');

var _Immutable2 = _interopRequireDefault(_Immutable);

var _BemMixin = require('../utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

'use strict';

var PureRenderMixin = _React2['default'].addons.PureRenderMixin;

var lang = _moment2['default']().localeData();

var WEEKDAYS = _Immutable2['default'].List(lang._weekdays).zip(_Immutable2['default'].List(lang._weekdaysShort));
var MONTHS = _Immutable2['default'].List(lang._months);

var CalendarMonth = _React2['default'].createClass({
  displayName: 'CalendarMonth',

  mixins: [_BemMixin2['default'], PureRenderMixin],

  renderDay: function renderDay(date, i) {
    var _props = this.props;
    var CalendarDate = _props.dateComponent;

    var props = _objectWithoutProperties(_props, ['dateComponent']);

    return _React2['default'].createElement(CalendarDate, _extends({}, props, { date: _moment2['default'](date), key: i }));
  },

  renderWeek: function renderWeek(dates, i) {
    var days = dates.map(this.renderDay);
    return _React2['default'].createElement(
      'tr',
      { className: this.cx({ element: 'Week' }), key: i },
      days.toJS()
    );
  },

  renderDayHeaders: function renderDayHeaders() {
    var firstOfWeek = this.props.firstOfWeek;

    var indices = _Immutable2['default'].Range(firstOfWeek, 7).concat(_Immutable2['default'].Range(0, firstOfWeek));

    var headers = indices.map((function (index) {
      var weekday = WEEKDAYS.get(index);
      return _React2['default'].createElement(
        'th',
        { className: this.cx({ element: 'WeekdayHeading' }), key: weekday, scope: 'col' },
        _React2['default'].createElement(
          'abbr',
          { title: weekday[0] },
          weekday[1]
        )
      );
    }).bind(this));

    return _React2['default'].createElement(
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
      return;
    }

    if (year > enabledRange.end.year()) {
      return;
    }

    return _React2['default'].createElement(
      'option',
      { key: year, value: year },
      year
    );
  },

  renderHeaderYear: function renderHeaderYear() {
    var firstOfMonth = this.props.firstOfMonth;

    var y = firstOfMonth.year();
    var years = _Immutable2['default'].Range(y - 5, y).concat(_Immutable2['default'].Range(y, y + 10));
    var choices = years.map(this.renderYearChoice);
    var modifiers = { year: true };

    return _React2['default'].createElement(
      'span',
      { className: this.cx({ element: 'MonthHeaderLabel', modifiers: modifiers }) },
      firstOfMonth.format('YYYY'),
      this.props.disableNavigation ? null : _React2['default'].createElement(
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

    if (_moment2['default']({ years: year, months: i + 1, date: 1 }).unix() < enabledRange.start.unix()) {
      disabled = true;
    }

    if (_moment2['default']({ years: year, months: i, date: 1 }).unix() > enabledRange.end.unix()) {
      disabled = true;
    }

    return _React2['default'].createElement(
      'option',
      { key: month, value: i, disabled: disabled ? 'disabled' : null },
      month
    );
  },

  renderHeaderMonth: function renderHeaderMonth() {
    var firstOfMonth = this.props.firstOfMonth;

    var choices = MONTHS.map(this.renderMonthChoice);
    var modifiers = { month: true };

    return _React2['default'].createElement(
      'span',
      { className: this.cx({ element: 'MonthHeaderLabel', modifiers: modifiers }) },
      firstOfMonth.format('MMMM'),
      this.props.disableNavigation ? null : _React2['default'].createElement(
        'select',
        { className: this.cx({ element: 'MonthHeaderSelect' }), value: firstOfMonth.month(), onChange: this.handleMonthChange },
        choices.toJS()
      )
    );
  },

  renderHeader: function renderHeader() {
    return _React2['default'].createElement(
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
    var monthDates = _Immutable2['default'].fromJS(cal.monthDates(firstOfMonth.year(), firstOfMonth.month()));
    var weeks = monthDates.map(this.renderWeek);

    return _React2['default'].createElement(
      'div',
      { className: this.cx({ element: 'Month' }) },
      this.renderHeader(),
      _React2['default'].createElement(
        'table',
        { className: this.cx({ element: 'MonthDates' }) },
        _React2['default'].createElement(
          'thead',
          null,
          this.renderDayHeaders()
        ),
        _React2['default'].createElement(
          'tbody',
          null,
          weeks.toJS()
        )
      )
    );
  }
});

exports['default'] = CalendarMonth;
module.exports = exports['default'];