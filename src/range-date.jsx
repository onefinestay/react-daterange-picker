/** @jsx React.DOM */
"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;
var moment = require('moment-range');
var _ = require('underscore');

var utils = require('./utils');


var AMState = React.createClass({
  render: function() {
    var classes = {
      'am-state': true
    };
    if (this.props.availabilityAction) {
      classes[this.props.availabilityAction] = true;
    }
    if (this.props.displayState) {
      classes[this.props.displayState] = true;
    }

    return (
      <div className={cx(classes)} />
    );
  }
});

var PMState = React.createClass({
  render: function() {
    var classes = {
      'pm-state': true
    };
    if (this.props.availabilityAction) {
      classes[this.props.availabilityAction] = true;
    }
    if (this.props.displayState) {
      classes[this.props.displayState] = true;
    }

    return (
      <div className={cx(classes)} />
    );
  }
});

var RangeDate = React.createClass({
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
    highlightedDate: React.PropTypes.object,
    selectedStartDate: React.PropTypes.instanceOf(Date),
    dateRanges: React.PropTypes.array,

    onHighlightDate: React.PropTypes.func,
    onUnHighlightDate: React.PropTypes.func,
    onStartSelection: React.PropTypes.func,
    onCompleteSelection: React.PropTypes.func
  },

  isDisabled: function(date) {
    var y = this.props.firstOfMonth.getFullYear();
    var m = this.props.firstOfMonth.getMonth();

    if (date.getMonth() !== m) {
      if (
        this.props.index < this.props.maxIndex &&
        date.getTime() >= new Date(y, m + 1, 1).getTime()
      ) {
        return true;
      }

      if (
        this.props.index > 0 &&
        date.getTime() <= new Date(y, m, 1).getTime()
      ) {
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

  isDateSelectable: function(date) {
    var dateRanges = this.dateRangesForDate(date);
    if (_.some(dateRanges, function(r) { return r.selectable; })) {
      return true;
    }
    return false;
  },

  nonSelectableStateRanges: function() {
    return _.chain(this.props.dateRanges)
      .filter(function(dates) {
        return !dates.selectable;
      })
      .map(function(dates) {
        var newStart = new Date(dates.range.start);
        var newEnd = new Date(dates.range.end);
        newStart.setDate(newStart.getDate());
        newEnd.setDate(newEnd.getDate());
        return {
          range: moment().range(newStart, newEnd),
          state: dates.state,
          selectable: dates.selectable
        };
      })
      .value();
  },

  dateRangesForDate: function(date) {
    return _.filter(this.props.dateRanges, function(dates) {
      if (dates.range.contains(date)) {
        return dates.range;
      }
    });
  },

  statesForRange: function(range) {
    return _.filter(this.props.dateRanges, function(dates) {
      if (dates.range.intersect(range)) {
        return dates.state;
      }
    });
  },

  sanitizeRange: function(range, forwards) {
    /* Truncates the provided range at the first intersection
     * with a non-selectable state. Using forwards to determine
     * which direction to work
     */
    var i;
    var blockedRanges = this.nonSelectableStateRanges();
    var blockedRange;
    var intersect;

    if (forwards) {
      for (i = 0; i < blockedRanges.length; i++) {
        blockedRange = blockedRanges[i];
        intersect = range.intersect(blockedRange.range);

        if (intersect) {
          return moment().range(range.start, intersect.start);
        }
      }
    } else {
      for (i = blockedRanges.length - 1; i >= 0; i--) {
        blockedRange = blockedRanges[i];
        intersect = range.intersect(blockedRange.range);

        if (intersect) {
          return moment().range(intersect.end, range.end);
        }
      }
    }
    return range;
  },

  highlightDate: function(date) {
    if (this.isDateSelectable(date)) {
      if (this.props.selectedStartDate) {
        var datePair = utils.sortDates(this.props.selectedStartDate, date);
        var range = moment().range(datePair[0], datePair[1]);
        var forwards = (
          range.start.toDate().getTime() ===
          this.props.selectedStartDate.getTime()
        );
        range = this.sanitizeRange(range, forwards);
        this.props.onHighlightRange(range);
      } else {
        this.props.onHighlightDate(date);
      }
    }
  },

  unHighlightDate: function(date) {
    this.props.onUnHighlightDate(date);
  },

  selectDate: function(date) {
    if (this.props.selectedStartDate) {
      // We already have one end of the range
      var datePair = utils.sortDates(this.props.selectedStartDate, date);
      var range = moment().range(datePair[0], datePair[1]);

      var forwards = range.start.toDate().getTime() === this.props.selectedStartDate.getTime();

      range = this.sanitizeRange(range, forwards);

      if (range && range.end.diff(range.start, 'days') > 0) {
        var states = this.statesForRange(range);
        this.props.onCompleteSelection(range, states);
      }
    } else if (this.isDateSelectable(date)) {
      this.props.onStartSelection(date);
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    var currentProps = this.props;

    if (!_.isEqual(
      this.getSegmentStates(currentProps),
      this.getSegmentStates(nextProps)
    )) {
      return true;
    }

    return false;
  },

  getClasses: function(props) {
    var date = props.date;
    var dateMoment = moment(date);
    var isOtherMonth = false;
    var isSelected = false;
    var isSelectedRange = false;
    var isHighlightedRange = false;
    var isHighlighted = false;

    var isDisabled = this.isDisabled(date);
    var range = null;

    var time = date.getTime();

    if (date.getMonth() !== props.firstOfMonth.getMonth()) {
      isOtherMonth = true;
    }

    if (!isDisabled) {
      if (props.value) {
        if (props.selectionType === 'range' && props.value.contains(date)) {
          isSelectedRange = true;
        } else if (props.selectionType === 'single' && props.value.getTime() === time) {
          isSelected = true;
        }
      }

      // Highlights (Hover states)
      if (props.highlightedDate && props.highlightedDate.getTime() === time) {
        isHighlighted = true;
      }

      if (props.highlightedRange) {
        if (props.highlightedRange.contains(date)) {
          isHighlightedRange = true;
        }
      }
    }

    var classes = {
      'react-calendar-date': true,
      'react-calendar-date-selected': isSelected,
      'react-calendar-date-selected-range': isSelectedRange,
      'react-calendar-date-highlighted': isHighlighted,
      'react-calendar-date-highlighted-range': isHighlightedRange,
      'react-calendar-date-disabled': isDisabled,
      'react-calendar-date-other-month': isOtherMonth
    };
    return classes;
  },

  getSegmentStates: function(props) {
    var date = props.date;
    var amDisplayState;
    var pmDisplayState;

    if (props.value && props.value.contains(date)) {
      if (props.value.start.toDate().getTime() === date.getTime()) {
        // It's the first day in the range, so only PM is selected
        pmDisplayState = 'selected';
      } else if (props.value.end.toDate().getTime() === date.getTime()) {
        // It's the last day in the range, so only AM is selected
        amDisplayState = 'selected';
      } else {
        // It's somewhere in the range, so AM and PM are selected
        amDisplayState = 'selected';
        pmDisplayState = 'selected';
      }
    }

    if (props.highlightedRange && props.highlightedRange.contains(date)) {
      if (props.highlightedRange.start.toDate().getTime() === date.getTime()) {
        pmDisplayState = 'highlighted';
      } else if (props.highlightedRange.end.toDate().getTime() === date.getTime()) {
        amDisplayState = 'highlighted';
      } else {
        amDisplayState = 'highlighted';
        pmDisplayState = 'highlighted';
      }
    }

    if (
      props.highlightedDate &&
      !props.highlightedRange &&
      date.getTime() === props.highlightedDate.getTime()
    ) {
        amDisplayState = 'highlighted';
        pmDisplayState = 'highlighted';
    }

    return {
      am: amDisplayState,
      pm: pmDisplayState
    };
  },

  render: function() {
    var classes = this.getClasses(this.props);
    var date = this.props.date;
    var amState;
    var pmState;
    var amDisplayState;
    var pmDisplayState;
    var amAction;
    var pmAction;
    var states = this.dateRangesForDate(date);

    if (states.length > 0) {
      if (states.length === 1) {
        // If there's only one state, it means we're not at a boundary, AM/PM are the same
        amAction = states[0].state;
        pmAction = states[0].state;
      } else {
        amAction = states[0].state;
        pmAction = states[1].state;
      }
    }

    var segementState = this.getSegmentStates(this.props);

    return (
      <td className={cx(classes)}
        onMouseEnter={_.partial(this.highlightDate, this.props.date)}
        onMouseLeave={_.partial(this.unHighlightDate, this.props.date)}
        onClick={_.partial(this.selectDate, this.props.date)}>
        <AMState displayState={segementState.am} availabilityAction={amAction} />
        <PMState displayState={segementState.pm} availabilityAction={pmAction} />
        <span className="react-datepicker-date-label">{this.props.date.getDate()}</span>
      </td>
    );
  }

});

module.exports = RangeDate;
