/** @jsx React.DOM */
"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;
var moment = require('moment');
var _ = require('underscore');


var SingleDate = React.createClass({
  propTypes: {
    date: React.PropTypes.instanceOf(Date).isRequired,

    firstOfMonth: React.PropTypes.instanceOf(Date).isRequired,
    index: React.PropTypes.number.isRequired,
    maxIndex: React.PropTypes.number.isRequired,
    selectionType: React.PropTypes.string.isRequired,

    value: React.PropTypes.object,
    minDate: React.PropTypes.instanceOf(Date),
    maxDate: React.PropTypes.instanceOf(Date),
    highlightedRange: React.PropTypes.object,
    highlightedDate: React.PropTypes.instanceOf(Date),
    selectedStartDate: React.PropTypes.instanceOf(Date),
    dateStates: React.PropTypes.array,

    onHighlightDate: React.PropTypes.func,
    onUnHighlightDate: React.PropTypes.func,
    onStartSelection: React.PropTypes.func,
    onCompleteSelection: React.PropTypes.func
  },

  isDisabled: function(date) {
    var y = this.props.firstOfMonth.getFullYear();
    var m = this.props.firstOfMonth.getMonth();

    if (date.getMonth() !== m) {
      if (this.props.index < this.props.maxIndex && date.getTime() >= new Date(y, m + 1, 1).getTime()) {
        return true;
      }
      if (this.props.index > 0 && date.getTime() <= new Date(y, m, 1).getTime()) {
        return true;
      }
    }

    if (this.props.minDate && date.getTime() < this.props.minDate.getTime()) {
      return true;
    }
    if (this.props.maxDate && date.getTime() > this.props.maxDate.getTime()) {
      return true;
    }
    return false;
  },

  highlightDate: function(date) {
    if (!this.isDisabled(date)) {
      this.props.onHighlightDate(date);
    }
  },

  unHighlightDate: function(date) {
    this.props.onUnHighlightDate(date);
  },

  selectDate: function(date) {
    if (!this.isDisabled(date)) {
      this.props.onSelect(date);
    }
  },

  getClasses: function() {
    var date = this.props.date;
    var dateMoment = moment(date);
    var isOtherMonth = false;
    var isSelected = false;
    var isHighlighted = false;

    var isDisabled = this.isDisabled(date);
    var range = null;

    var time = date.getTime();

    if (date.getMonth() !== this.props.firstOfMonth.getMonth()) {
      isOtherMonth = true;
    }

    if (!isDisabled) {
      // Selections
      if (this.props.value && (time === this.props.value.toDate().getTime())) {
        isSelected = true;
      }

      // Highlights (Hover states)
      if (this.props.highlightedDate && this.props.highlightedDate.getTime() === time) {
        isHighlighted = true;
      }
    }

    var classes = {
      'react-calendar-date': true,
      'react-calendar-date-selected': isSelected,
      'react-calendar-date-highlighted': isHighlighted,
      'react-calendar-date-disabled': isDisabled,
      'react-calendar-date-other-month': isOtherMonth
    };
    return classes;
  },

  render: function() {
    var classes = this.getClasses();
    var date = this.props.date;

    return (
      <td className={cx(classes)} onMouseEnter={_.partial(this.highlightDate, this.props.date)} onMouseLeave={_.partial(this.unHighlightDate, this.props.date)} onClick={_.partial(this.selectDate, this.props.date)}>
        <span className="react-datepicker-date-label">{this.props.date.getDate()}</span>
      </td>
    );
  }
});

module.exports = SingleDate;
