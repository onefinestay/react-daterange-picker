import React from 'react';

import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import moment from '../moment-range';
import calendar from 'calendar';
import Immutable from 'immutable';

import BemMixin from '../utils/BemMixin';
import CustomPropTypes from '../utils/CustomPropTypes';
import isMomentRange from '../utils/isMomentRange';
import PureRenderMixin from '../utils/PureRenderMixin';

const CalendarMonth = createClass({
  mixins: [BemMixin, PureRenderMixin],
  displayName: "CalendarMonth",

  propTypes: {
    dateComponent: PropTypes.func,
    disableNavigation: PropTypes.bool,
    enabledRange: CustomPropTypes.momentRange,
    firstOfMonth: CustomPropTypes.moment,
    firstOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    hideSelection: PropTypes.bool,
    highlightedDate: PropTypes.object,
    highlightedRange: PropTypes.object,
    onMonthChange: PropTypes.func,
    onYearChange: PropTypes.func,
    value: CustomPropTypes.momentOrMomentRange,
    locale: PropTypes.string,
  },

  setLocale(locale) {
    moment.locale(locale);
    this.WEEKDAYS = Immutable.List(moment.weekdays()).zip(Immutable.List(moment.weekdaysShort()));
    this.MONTHS = Immutable.List(moment.months());
  },

  componentWillMount() {
    const { locale } = this.props;
    this.setLocale(locale);
  },

  componentWillReceiveProps(nextProps) {
    const { locale } = nextProps;
    if (locale !== this.props.locale) {
      this.setLocale(locale);
    }
  },

  renderDay(date, i) {
    let {dateComponent: CalendarDate, value, highlightedDate, highlightedRange, hideSelection, enabledRange, ...props} = this.props;
    let d = moment(date).locale(this.props.locale);

    let isInSelectedRange;
    let isSelectedDate;
    let isSelectedRangeStart;
    let isSelectedRangeEnd;

    if (!hideSelection && value && moment.isMoment(value) && value.isSame(d, 'day')) {
      isSelectedDate = true;
    } else if (!hideSelection && value && isMomentRange(value) && value.contains(d)) {
      isInSelectedRange = true;

      isSelectedRangeStart = value.start.isSame(d, 'day');
      isSelectedRangeEnd = value.end.isSame(d, 'day');
    }

    return (
      <CalendarDate
        key={i}
        isToday={d.isSame(moment(), 'day')}
        isDisabled={!enabledRange.contains(d)}
        isHighlightedDate={!!(highlightedDate && highlightedDate.isSame(d, 'day'))}
        isHighlightedRangeStart={!!(highlightedRange && highlightedRange.start.isSame(d, 'day'))}
        isHighlightedRangeEnd={!!(highlightedRange && highlightedRange.end.isSame(d, 'day'))}
        isInHighlightedRange={!!(highlightedRange && highlightedRange.contains(d))}
        isSelectedDate={isSelectedDate}
        isSelectedRangeStart={isSelectedRangeStart}
        isSelectedRangeEnd={isSelectedRangeEnd}
        isInSelectedRange={isInSelectedRange}
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
      let weekday = this.WEEKDAYS.get(index);
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
      return null;
    }

    if (year > enabledRange.end.year()) {
      return null;
    }

    return (
      <option key={year} value={year}>{moment(year, 'YYYY').locale(this.props.locale).format('YYYY')}</option>
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
        {firstOfMonth.locale(this.props.locale).format('YYYY')}
        {this.props.disableNavigation ? null : <select className={this.cx({element: 'MonthHeaderSelect'})} value={y} onChange={this.handleYearChange}>{choices.toJS()}</select>}
      </span>
    );
  },

  handleMonthChange(event) {
    this.props.onMonthChange(parseInt(event.target.value, 10));
  },

  renderMonthChoice(month, i) {
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
    let choices = this.MONTHS.map(this.renderMonthChoice);
    let modifiers = {month: true};

    return (
      <span className={this.cx({element: 'MonthHeaderLabel', modifiers})}>
        {firstOfMonth.locale(this.props.locale).format('MMMM')}
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
  },
});

export default CalendarMonth;
