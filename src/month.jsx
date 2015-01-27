'use strict';

import React from 'react/addons';
import moment from 'moment';
import calendar from 'calendar';
import _ from 'underscore';

var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var lang = moment().localeData();

var WEEKDAYS = _.zip(lang._weekdays, lang._weekdaysShort);
var MONTHS = lang._months;


var Month = React.createClass({
  mixins: [PureRenderMixin],

  renderDay(date, i) {
    var DateComponent = this.props.dateComponent;

    return <DateComponent {...this.props} date={date} key={i} />;
  },

  renderWeek(dates, i) {
    var days = _.map(dates, this.renderDay);
    return (
      <tr className="reactDaterangePicker__week" key={i}>{days}</tr>
    );
  },

  renderDayHeaders() {
    var indices = _.range(this.props.firstOfWeek ,7).concat(_.range(0, this.props.firstOfWeek));

    var headers = _.map(indices, function(index) {
        var weekday = WEEKDAYS[index];
        return (
          <th className="reactDaterangePicker__weekdayHeading" key={weekday} scope="col"><abbr title={weekday[0]}>{weekday[1]}</abbr></th>
        );
    });

    return (
      <tr className="reactDaterangePicker__weekdays">{headers}</tr>
    );
  },

  handleYearChange(event) {
    this.props.onYearChange(parseInt(event.target.value, 10));
  },

  renderYearChoice(year, i) {
    if (this.props.minDate && year < this.props.minDate.getFullYear()) {
      return;
    }

    if (this.props.maxDate && year > this.props.maxDate.getFullYear()) {
      return;
    }

    return (
      <option key={year} value={year}>{year}</option>
    );
  },

  renderHeaderYear() {
    var monthMoment = moment(this.props.firstOfMonth);
    var y = this.props.firstOfMonth.getFullYear();
    var years = _.range(y - 5, y).concat(_.range(y, y + 10));
    var choices = _.map(years, this.renderYearChoice);

    return (
      <span className="reactDaterangePicker__monthHeaderLabel reactDaterangePicker__monthHeaderLabel--year">
        {monthMoment.format('YYYY')}
        {this.props.disableNavigation ? null : <select className="reactDaterangePicker__monthHeaderSelect" value={y} onChange={this.handleYearChange}>{choices}</select>}
      </span>
    );
  },

  handleMonthChange(event) {
    this.props.onMonthChange(parseInt(event.target.value, 10));
  },

  renderMonthChoice(month , i) {
    var disabled = false;
    var year = this.props.firstOfMonth.getFullYear();

    if (this.props.minDate && new Date(year, i + 1, 1).getTime() < this.props.minDate.getTime()) {
      disabled = true;
    }

    if (this.props.maxDate && new Date(year, i, 1).getTime() > this.props.maxDate.getTime()) {
      disabled = true;
    }

    return (
      <option key={month} value={i} disabled={disabled ? 'disabled' : null}>{month}</option>
    );
  },

  renderHeaderMonth() {
    var monthMoment = moment(this.props.firstOfMonth);

    var choices = _.map(MONTHS, this.renderMonthChoice);

    return (
      <span className="reactDaterangePicker__monthHeaderLabel reactDaterangePicker__monthHeaderLabel--month">
        {monthMoment.format('MMMM')}
        {this.props.disableNavigation ? null : <select className="reactDaterangePicker__monthHeaderSelect" value={this.props.month} onChange={this.handleMonthChange}>{choices}</select>}
      </span>
    );
  },

  renderHeader() {
    return (
      <div className="reactDaterangePicker__monthHeader">
        {this.renderHeaderMonth()} {this.renderHeaderYear()}
      </div>
    );
  },

  render() {
    var cal = new calendar.Calendar(this.props.firstOfWeek);
    var monthDates = cal.monthDates(this.props.firstOfMonth.getFullYear(), this.props.firstOfMonth.getMonth());
    var weeks = _.map(monthDates, this.renderWeek);

    return (
      <div className="reactDaterangePicker__month">
        {this.renderHeader()}
        <table className="reactDaterangePicker__monthDates">
          <thead>
            {this.renderDayHeaders()}
          </thead>
          <tbody>
            {weeks}
          </tbody>
        </table>
      </div>
    );
  }
});

export default Month;
