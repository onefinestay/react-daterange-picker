"use strict";

var _objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var moment = _interopRequire(require("moment"));

var calendar = _interopRequire(require("calendar"));

var Immutable = _interopRequire(require("immutable"));

var BemMixin = _interopRequire(require("../utils/BemMixin"));

var PureRenderMixin = React.addons.PureRenderMixin;

var lang = moment().localeData();

var WEEKDAYS = Immutable.List(lang._weekdays).zip(Immutable.List(lang._weekdaysShort));
var MONTHS = Immutable.List(lang._months);


var CalendarMonth = React.createClass({
  displayName: "CalendarMonth",
  mixins: [BemMixin, PureRenderMixin],

  renderDay: function renderDay(date, i) {
    var CalendarDate = this.props.dateComponent;
    var props = _objectWithoutProperties(this.props, ["dateComponent"]);

    return React.createElement(CalendarDate, React.__spread({}, props, { date: moment(date), key: i }));
  },

  renderWeek: function renderWeek(dates, i) {
    var days = dates.map(this.renderDay);
    return React.createElement(
      "tr",
      { className: this.cx({ element: "Week" }), key: i },
      days.toJS()
    );
  },

  renderDayHeaders: function renderDayHeaders() {
    var firstOfWeek = this.props.firstOfWeek;
    var indices = Immutable.Range(firstOfWeek, 7).concat(Immutable.Range(0, firstOfWeek));

    var headers = indices.map((function (index) {
      var weekday = WEEKDAYS.get(index);
      return React.createElement(
        "th",
        { className: this.cx({ element: "WeekdayHeading" }), key: weekday, scope: "col" },
        React.createElement(
          "abbr",
          { title: weekday[0] },
          weekday[1]
        )
      );
    }).bind(this));

    return React.createElement(
      "tr",
      { className: this.cx({ element: "Weekdays" }) },
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

    return React.createElement(
      "option",
      { key: year, value: year },
      year
    );
  },

  renderHeaderYear: function renderHeaderYear() {
    var firstOfMonth = this.props.firstOfMonth;
    var y = firstOfMonth.year();
    var years = Immutable.Range(y - 5, y).concat(Immutable.Range(y, y + 10));
    var choices = years.map(this.renderYearChoice);
    var modifiers = { year: true };

    return React.createElement(
      "span",
      { className: this.cx({ element: "MonthHeaderLabel", modifiers: modifiers }) },
      firstOfMonth.format("YYYY"),
      this.props.disableNavigation ? null : React.createElement(
        "select",
        { className: this.cx({ element: "MonthHeaderSelect" }), value: y, onChange: this.handleYearChange },
        choices.toJS()
      )
    );
  },

  handleMonthChange: function handleMonthChange(event) {
    this.props.onMonthChange(parseInt(event.target.value, 10));
  },

  renderMonthChoice: function renderMonthChoice(month, i) {
    var firstOfMonth = this.props.firstOfMonth;
    var enabledRange = this.props.enabledRange;
    var disabled = false;
    var year = firstOfMonth.year();

    if (moment({ years: year, months: i + 1, date: 1 }).unix() < enabledRange.start.unix()) {
      disabled = true;
    }

    if (moment({ years: year, months: i, date: 1 }).unix() > enabledRange.end.unix()) {
      disabled = true;
    }

    return React.createElement(
      "option",
      { key: month, value: i, disabled: disabled ? "disabled" : null },
      month
    );
  },

  renderHeaderMonth: function renderHeaderMonth() {
    var firstOfMonth = this.props.firstOfMonth;
    var choices = MONTHS.map(this.renderMonthChoice);
    var modifiers = { month: true };

    return React.createElement(
      "span",
      { className: this.cx({ element: "MonthHeaderLabel", modifiers: modifiers }) },
      firstOfMonth.format("MMMM"),
      this.props.disableNavigation ? null : React.createElement(
        "select",
        { className: this.cx({ element: "MonthHeaderSelect" }), value: firstOfMonth.month(), onChange: this.handleMonthChange },
        choices.toJS()
      )
    );
  },

  renderHeader: function renderHeader() {
    return React.createElement(
      "div",
      { className: this.cx({ element: "MonthHeader" }) },
      this.renderHeaderMonth(),
      " ",
      this.renderHeaderYear()
    );
  },

  render: function render() {
    var firstOfWeek = this.props.firstOfWeek;
    var firstOfMonth = this.props.firstOfMonth;


    var cal = new calendar.Calendar(firstOfWeek);
    var monthDates = Immutable.fromJS(cal.monthDates(firstOfMonth.year(), firstOfMonth.month()));
    var weeks = monthDates.map(this.renderWeek);

    return React.createElement(
      "div",
      { className: this.cx({ element: "Month" }) },
      this.renderHeader(),
      React.createElement(
        "table",
        { className: this.cx({ element: "MonthDates" }) },
        React.createElement(
          "thead",
          null,
          this.renderDayHeaders()
        ),
        React.createElement(
          "tbody",
          null,
          weeks.toJS()
        )
      )
    );
  }
});

module.exports = CalendarMonth;