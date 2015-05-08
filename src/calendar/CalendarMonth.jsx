'use strict';

import React from 'react/addons';
import moment from 'moment';
import calendar from 'calendar';
import Immutable from 'immutable';

import BemMixin from '../utils/BemMixin';
import isMomentRange from '../utils/isMomentRange';

const PureRenderMixin = React.addons.PureRenderMixin;

const lang = moment().localeData();

const WEEKDAYS = Immutable.List(lang._weekdays).zip(Immutable.List(lang._weekdaysShort));
const MONTHS = Immutable.List(lang._months);


const CalendarMonth = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  renderDay(date, i) {
    let {dateComponent: CalendarDate, value: actualValue, highlightedDate, highlightedRange, hideSelection, enabledRange, ...props} = this.props;
    let d = moment(date);
    let value;

    if (!hideSelection && actualValue && moment.isMoment(actualValue) && actualValue.isSame(d)) {
      value = actualValue;
    } else if (!hideSelection && actualValue && isMomentRange(actualValue) && actualValue.contains(d)) {
      value = actualValue;
    }

    return (
      <CalendarDate
        key={i}
        enabledRange={enabledRange}
        isDisabled={enabledRange.contains(d)}
        highlightedDate={highlightedDate && highlightedDate.isSame(d) ? highlightedDate : null}
        highlightedRange={highlightedRange && highlightedRange.contains(d) ? highlightedRange : null}
        value={value}
        date={d}
        {...props} />
    );
  },

  renderWeek(dates, i) {
    let days = dates.map(this.renderDay);
    return (
      <tr className={this.cx({element: 'Week'})} key={i}>{days.toJS()}</tr>
    );
  },

  renderDayHeaders() {
    let {firstOfWeek} = this.props;
    let indices = Immutable.Range(firstOfWeek, 7).concat(Immutable.Range(0, firstOfWeek));

    let headers = indices.map(function(index) {
      let weekday = WEEKDAYS.get(index);
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
    let {enabledRange} = this.props;

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
    let {firstOfMonth} = this.props;
    let y = firstOfMonth.year();
    let years = Immutable.Range(y - 5, y).concat(Immutable.Range(y, y + 10));
    let choices = years.map(this.renderYearChoice);
    let modifiers = {year: true};

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
    let {firstOfMonth, enabledRange} = this.props;
    let disabled = false;
    let year = firstOfMonth.year();

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
    let {firstOfMonth} = this.props;
    let choices = MONTHS.map(this.renderMonthChoice);
    let modifiers = {month: true};

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
    let {firstOfWeek, firstOfMonth} = this.props;

    let cal = new calendar.Calendar(firstOfWeek);
    let monthDates = Immutable.fromJS(cal.monthDates(firstOfMonth.year(), firstOfMonth.month()));
    let weeks = monthDates.map(this.renderWeek);

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
