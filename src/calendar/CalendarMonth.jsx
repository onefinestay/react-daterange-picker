'use strict';

import React from 'react/addons';
import moment from 'moment';
import calendar from 'calendar';
import Immutable from 'immutable';

import BemMixin from '../utils/BemMixin';

var PureRenderMixin = React.addons.PureRenderMixin;

var lang = moment().localeData();

var WEEKDAYS = Immutable.List(lang._weekdays).zip(Immutable.List(lang._weekdaysShort));
var MONTHS = Immutable.List(lang._months);


var CalendarMonth = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  renderDay(date, i) {
    var {dateComponent: CalendarDate, ...props} = this.props;

    return <CalendarDate {...props} date={moment(date)} key={i} />;
  },

  renderWeek(dates, i) {
    var days = dates.map(this.renderDay);
    return (
      <tr className={this.cx({element: 'Week'})} key={i}>{days.toJS()}</tr>
    );
  },

  renderDayHeaders() {
    var {firstOfWeek} = this.props;
    var indices = Immutable.Range(firstOfWeek, 7).concat(Immutable.Range(0, firstOfWeek));

    var headers = indices.map(function(index) {
      var weekday = WEEKDAYS.get(index);
      return (
        <th className={this.cx({element: 'WeekdayHeading'})} key={weekday} scope="col"><abbr title={weekday[0]}>{weekday[1]}</abbr></th>
      );
    }.bind(this));

    return (
      <tr className={this.cx({element: 'Weekdays'})}>{headers.toJS()}</tr>
    );
  },

  handleYearChange(event) {
    this.props.onYearChange(parseInt(event.target.value, 10));
  },

  renderYearChoice(year) {
    var {enabledRange} = this.props;

     if (year < enabledRange.start.year()) {
      return;
    }

    if (year > enabledRange.end.year()) {
      return;
    }

    return (
      <option key={year} value={year}>{year}</option>
    );
  },

  renderHeaderYear() {
    var {firstOfMonth} = this.props;
    var y = firstOfMonth.year();
    var years = Immutable.Range(y - 5, y).concat(Immutable.Range(y, y + 10));
    var choices = years.map(this.renderYearChoice);
    var modifiers = {year: true};

    return (
      <span className={this.cx({element: 'MonthHeaderLabel', modifiers})}>
        {firstOfMonth.format('YYYY')}
        {this.props.disableNavigation ? null : <select className={this.cx({element: 'MonthHeaderSelect'})} value={y} onChange={this.handleYearChange}>{choices.toJS()}</select>}
      </span>
    );
  },

  handleMonthChange(event) {
    this.props.onMonthChange(parseInt(event.target.value, 10));
  },

  renderMonthChoice(month , i) {
    var {firstOfMonth, enabledRange} = this.props;
    var disabled = false;
    var year = firstOfMonth.year();

    if (moment({years: year, months: i + 1, date: 1}).unix() < enabledRange.start.unix()) {
      disabled = true;
    }

    if (moment({years: year, months: i, date: 1}).unix() > enabledRange.end.unix()) {
      disabled = true;
    }

    return (
      <option key={month} value={i} disabled={disabled ? 'disabled' : null}>{month}</option>
    );
  },

  renderHeaderMonth() {
    var {firstOfMonth} = this.props;
    var choices = MONTHS.map(this.renderMonthChoice);
    var modifiers = {month: true};

    return (
      <span className={this.cx({element: 'MonthHeaderLabel', modifiers})}>
        {firstOfMonth.format('MMMM')}
        {this.props.disableNavigation ? null : <select className={this.cx({element: 'MonthHeaderSelect'})} value={firstOfMonth.month()} onChange={this.handleMonthChange}>{choices.toJS()}</select>}
      </span>
    );
  },

  renderHeader() {
    return (
      <div className={this.cx({element: 'MonthHeader'})}>
        {this.renderHeaderMonth()} {this.renderHeaderYear()}
      </div>
    );
  },

  render() {
    var {firstOfWeek, firstOfMonth} = this.props;

    var cal = new calendar.Calendar(firstOfWeek);
    var monthDates = Immutable.fromJS(cal.monthDates(firstOfMonth.year(), firstOfMonth.month()));
    var weeks = monthDates.map(this.renderWeek);

    return (
      <div className={this.cx({element: 'Month'})}>
        {this.renderHeader()}
        <table className={this.cx({element: 'MonthDates'})}>
          <thead>
            {this.renderDayHeaders()}
          </thead>
          <tbody>
            {weeks.toJS()}
          </tbody>
        </table>
      </div>
    );
  }
});

export default CalendarMonth;
