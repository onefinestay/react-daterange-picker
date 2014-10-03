/** @jsx React.DOM */
"use strict";

var React = require('react/addons');
var moment = require('moment');
var _ = require('underscore');

var Month = require('./month.jsx');
var SingleDate = require('./single-date.jsx');
var RangeDate = require('./range-date.jsx');

var noop = function() {};


var RangePicker = React.createClass({
  propTypes: {
    numberOfCalendars: React.PropTypes.number,
    firstOfWeek: React.PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    disableNavigation: React.PropTypes.bool,
    initialDate: React.PropTypes.instanceOf(Date),
    initialRange: React.PropTypes.object,
    initialMonth: React.PropTypes.number, // Overrides values derived from initialDate/initialRange
    initialYear: React.PropTypes.number, // Overrides values derived from initialDate/initialRange
    earliestDate: React.PropTypes.instanceOf(Date),
    latestDate: React.PropTypes.instanceOf(Date),
    selectionType: React.PropTypes.oneOf(['single', 'range']),
    dateStates: React.PropTypes.array, // an array of date ranges and their states
    value: React.PropTypes.object, // range or single value
    onSelect: React.PropTypes.func
  },

  getDefaultProps: function() {
    var date = new Date();
    var initialDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return {
      numberOfCalendars: 1,
      firstOfWeek: 0,
      disableNavigation: false,
      nextLabel: '',
      previousLabel: '',
      initialDate: initialDate,
      selectionType: 'single',
      onSelect: noop
    };
  },

  getInitialState: function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();

    if (this.props.initialYear && this.props.initialMonth) {
      year = this.props.initialYear;
      month = this.props.initialMonth;
    }

    return {
      year: year,
      month: month,
      selectedStartDate: null,
      highlightStartDate: null,
      highlightedDate: null,
      highlightRange: null
    };
  },

  onSelect: function(date) {
    this.props.onSelect(moment(date));
  },

  onStartSelection: function(date) {
    this.setState({
      selectedStartDate: date
    });
  },

  onCompleteSelection: function(range, states) {
    this.setState({
      selectedStartDate: null,
      highlightedRange: null,
      highlightedDate: null
    });
    this.props.onSelect(range, states);
  },

  onHighlightDate: function(date) {
    this.setState({
      highlightedDate: date,
    });
  },

  onHighlightRange: function(range) {
    this.setState({
      highlightedRange: range,
      highlightedDate: null
    });
  },

  onUnHighlightDate: function(date) {
    this.setState({
      highlightedDate: null
    });
  },

  getMonthDate: function() {
    return new Date(this.state.year, this.state.month, 1);
  },

  moveForward: function() {
    var monthDate = this.getMonthDate();
    monthDate.setMonth(monthDate.getMonth() + 1);
    this.setState({
      year: monthDate.getFullYear(),
      month: monthDate.getMonth()
    });
  },

  moveBack: function() {
    var monthDate = this.getMonthDate();
    monthDate.setMonth(monthDate.getMonth() - 1);
    this.setState({
      year: monthDate.getFullYear(),
      month: monthDate.getMonth()
    });
  },

  changeYear: function(year) {
    var month = this.state.month;

    if (this.props.earliestDate && new Date(year, month, 1).getTime() < this.props.earliestDate.getTime()) {
      month = this.props.earliestDate.getMonth();
    }

    if (this.props.latestDate && new Date(year, month + 1, 1).getTime() > this.props.latestDate.getTime()) {
      month = this.props.latestDate.getMonth();
    }

    this.setState({
      year: year,
      month: month
    });
  },

  changeMonth: function(date) {
    this.setState({
      month: date
    });
  },

  renderCalendar: function(index) {
    var monthDate = this.getMonthDate();
    var year = monthDate.getFullYear();
    var month = monthDate.getMonth();
    var key = index + '-' + year + '-' + month;

    monthDate = new Date(year, month + index, 1);

    var props = {
      index: index,
      maxIndex: this.props.numberOfCalendars - 1,
      minDate: this.props.earliestDate,
      maxDate: this.props.latestDate,
      firstOfMonth: monthDate,
      firstOfWeek: this.props.firstOfWeek,
      onMonthChange: this.changeMonth,
      onYearChange: this.changeYear,
      key: key,
      value: this.props.value,
      highlightStartDate: this.state.highlightStartDate,
      selectionType: this.props.selectionType,
      selectedStartDate: this.state.selectedStartDate,
      highlightedDate: this.state.highlightedDate,
      highlightedRange: this.state.highlightedRange,
      onHighlightRange: this.onHighlightRange,
      onHighlightDate: this.onHighlightDate,
      onUnHighlightDate: this.onUnHighlightDate,
      onSelect: this.onSelect,
      onStartSelection: this.onStartSelection,
      onCompleteSelection: this.onCompleteSelection,
      dateComponent: this.props.selectionType == 'range' ? RangeDate : SingleDate,
      dateStates: this.props.dateStates
    };

    return Month(props);
  },

  render: function() {
    var range = _.range(this.props.numberOfCalendars);
    var calendars = _.map(range, this.renderCalendar);

    return (
      <div className="react-calendars">
        <div className="react-calendar-previous" onClick={this.moveBack}>
          <div className="arrow"></div>
        </div>
        {calendars}
        <div className="react-calendar-next" onClick={this.moveForward}>
          <div className="arrow"></div>
        </div>
      </div>
    );
  }
});

module.exports = RangePicker;
