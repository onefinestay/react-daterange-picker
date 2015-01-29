"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var moment = _interopRequire(require("moment"));

var calendar = _interopRequire(require("calendar"));

var Immutable = _interopRequire(require("immutable"));

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;

var lang = moment().localeData();

var WEEKDAYS = Immutable.List(lang._weekdays).zip(Immutable.List(lang._weekdaysShort));
var MONTHS = Immutable.List(lang._months);


var Month = React.createClass({
  displayName: "Month",
  mixins: [PureRenderMixin],

  renderDay: function renderDay(date, i) {
    var DateComponent = this.props.dateComponent;

    return React.createElement(DateComponent, React.__spread({}, this.props, { date: date, key: i }));
  },

  renderWeek: function renderWeek(dates, i) {
    var days = dates.map(this.renderDay);
    return React.createElement(
      "tr",
      { className: "reactDaterangePicker__week", key: i },
      days.toJS()
    );
  },

  renderDayHeaders: function renderDayHeaders() {
    var indices = Immutable.Range(this.props.firstOfWeek, 7).concat(Immutable.Range(0, this.props.firstOfWeek));

    var headers = indices.map(function (index) {
      var weekday = WEEKDAYS.get(index);
      return React.createElement(
        "th",
        { className: "reactDaterangePicker__weekdayHeading", key: weekday, scope: "col" },
        React.createElement(
          "abbr",
          { title: weekday[0] },
          weekday[1]
        )
      );
    });

    return React.createElement(
      "tr",
      { className: "reactDaterangePicker__weekdays" },
      headers.toJS()
    );
  },

  handleYearChange: function handleYearChange(event) {
    this.props.onYearChange(parseInt(event.target.value, 10));
  },

  renderYearChoice: function renderYearChoice(year, i) {
    if (this.props.minDate && year < this.props.minDate.getFullYear()) {
      return;
    }

    if (this.props.maxDate && year > this.props.maxDate.getFullYear()) {
      return;
    }

    return React.createElement(
      "option",
      { key: year, value: year },
      year
    );
  },

  renderHeaderYear: function renderHeaderYear() {
    var monthMoment = moment(this.props.firstOfMonth);
    var y = this.props.firstOfMonth.getFullYear();
    var years = Immutable.Range(y - 5, y).concat(Immutable.Range(y, y + 10));
    var choices = years.map(this.renderYearChoice);

    return React.createElement(
      "span",
      { className: "reactDaterangePicker__monthHeaderLabel reactDaterangePicker__monthHeaderLabel--year" },
      monthMoment.format("YYYY"),
      this.props.disableNavigation ? null : React.createElement(
        "select",
        { className: "reactDaterangePicker__monthHeaderSelect", value: y, onChange: this.handleYearChange },
        choices.toJS()
      )
    );
  },

  handleMonthChange: function handleMonthChange(event) {
    this.props.onMonthChange(parseInt(event.target.value, 10));
  },

  renderMonthChoice: function renderMonthChoice(month, i) {
    var disabled = false;
    var year = this.props.firstOfMonth.getFullYear();

    if (this.props.minDate && new Date(year, i + 1, 1).getTime() < this.props.minDate.getTime()) {
      disabled = true;
    }

    if (this.props.maxDate && new Date(year, i, 1).getTime() > this.props.maxDate.getTime()) {
      disabled = true;
    }

    return React.createElement(
      "option",
      { key: month, value: i, disabled: disabled ? "disabled" : null },
      month
    );
  },

  renderHeaderMonth: function renderHeaderMonth() {
    var monthMoment = moment(this.props.firstOfMonth);

    var choices = MONTHS.map(this.renderMonthChoice);

    return React.createElement(
      "span",
      { className: "reactDaterangePicker__monthHeaderLabel reactDaterangePicker__monthHeaderLabel--month" },
      monthMoment.format("MMMM"),
      this.props.disableNavigation ? null : React.createElement(
        "select",
        { className: "reactDaterangePicker__monthHeaderSelect", value: this.props.month, onChange: this.handleMonthChange },
        choices.toJS()
      )
    );
  },

  renderHeader: function renderHeader() {
    return React.createElement(
      "div",
      { className: "reactDaterangePicker__monthHeader" },
      this.renderHeaderMonth(),
      " ",
      this.renderHeaderYear()
    );
  },

  render: function render() {
    var cal = new calendar.Calendar(this.props.firstOfWeek);
    var monthDates = Immutable.fromJS(cal.monthDates(this.props.firstOfMonth.getFullYear(), this.props.firstOfMonth.getMonth()));
    var weeks = monthDates.map(this.renderWeek);

    return React.createElement(
      "div",
      { className: "reactDaterangePicker__month" },
      this.renderHeader(),
      React.createElement(
        "table",
        { className: "reactDaterangePicker__monthDates" },
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

module.exports = Month;