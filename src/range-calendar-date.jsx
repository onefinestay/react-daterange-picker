/** @jsx React.DOM */
"use strict";

var React = require('react/addons');
var cx = React.addons.classSet;
var moment = require('moment-range');
var _ = require('underscore');

var sortDates = function() {
  return _.sortBy(arguments, function(d) { return d.getTime(); });
};

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

var RangeCalendarDate = React.createClass({
  propTypes: {
    allowedDates: React.PropTypes.array.isRequired,
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

  isDateSelectable: function(date) {
    var stateRanges = this.stateRangesForDate(date);
    if (_.some(stateRanges, function(r) { return r.selectable; })) {
      return true;
    }
    return false;
  },

  nonSelectableStateRanges: function() {
    return _.chain(this.props.allowedDates)
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

  stateRangesForDate: function(date) {
    return _.filter(this.props.allowedDates, function(dates) {
      if (dates.range.contains(date)) {
        return dates.range;
      }
    });
  },

  /*
    this.state.stateRanges = this.state.stateRanges.map(function(range) {
      var r = moment().range(range[0], range[1]);
      return {
        range: r,
        state: range[2],
        selectable: range[3]
      };
    });


  */

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
        var datePair = sortDates(this.props.selectedStartDate, date);
        var range = moment().range(datePair[0], datePair[1]);
        var forwards = (
          range.start.toDate().getTime() ===
          this.props.selectedStartDate.getTime()
        );
        /*range = this.sanitizeRange(range, forwards);*/
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
    var store = this.getFlux().store('AvailabilityStore');
    var states;

    if (this.props.selectedStartDate) {
      // We already have one end of the range
      var datePair = sortDates(this.props.selectedStartDate, date);
      var range = moment().range(datePair[0], datePair[1]);

      var forwards = range.start.toDate().getTime() === this.props.selectedStartDate.getTime();

      range = store.sanitizeRange(range, forwards);

      if (range) {
        if (range.end.diff(range.start, 'days') > 0) {
          states = store.statesForRange(range);
          this.props.onCompleteSelection(range, states);
        }
      }
    } else if (store.isDateSelectable(date)) {
      this.props.onStartSelection(date);
    }
  },

  getClasses: function() {
    var date = this.props.date;
    var dateMoment = moment(date);
    var isOtherMonth = false;
    var isSelected = false;
    var isSelectedRange = false;
    var isHighlightedRange = false;
    var isHighlighted = false;

    var isDisabled = this.isDisabled(date);
    var range = null;

    var time = date.getTime();

    if (date.getMonth() !== this.props.firstOfMonth.getMonth()) {
      isOtherMonth = true;
    }

    if (!isDisabled) {
      if (this.props.value) {
        if (this.props.selectionType === 'range' && this.props.value.contains(date)) {
          isSelectedRange = true;
        } else if (this.props.selectionType === 'single' && this.props.value.getTime() === time) {
          isSelected = true;
        }
      }

      // Highlights (Hover states)
      if (this.props.highlightedDate && this.props.highlightedDate.getTime() === time) {
        isHighlighted = true;
      }

      if (this.props.highlightedRange) {
        if (this.props.highlightedRange.contains(date)) {
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

  render: function() {
    var classes = this.getClasses();
    var date = this.props.date;
    var amState;
    var pmState;
    var amDisplayState;
    var pmDisplayState;
    var amAction;
    var pmAction;
    var states = this.stateRangesForDate(date);

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

    if (this.props.value && this.props.value.contains(date)) {
      if (this.props.value.start.toDate().getTime() === date.getTime()) {
        // It's the first day in the range, so only PM is selected
        pmDisplayState = 'selected';
      } else if (this.props.value.end.toDate().getTime() === date.getTime()) {
        // It's the last day in the range, so only AM is selected
        amDisplayState = 'selected';
      } else {
        // It's somewhere in the range, so AM and PM are selected
        amDisplayState = 'selected';
        pmDisplayState = 'selected';
      }
    }

    if (this.props.highlightedRange && this.props.highlightedRange.contains(date)) {
      if (this.props.highlightedRange.start.toDate().getTime() === date.getTime()) {
        pmDisplayState = 'highlighted';
      } else if (this.props.highlightedRange.end.toDate().getTime() === date.getTime()) {
        amDisplayState = 'highlighted';
      } else {
        amDisplayState = 'highlighted';
        pmDisplayState = 'highlighted';
      }
    }

    if (this.props.highlightedDate && !this.props.highlightedRange && date.getTime() === this.props.highlightedDate.getTime()) {
        amDisplayState = 'highlighted';
        pmDisplayState = 'highlighted';
    }

    return (
      <td className={cx(classes)} onMouseEnter={_.partial(this.highlightDate, this.props.date)} onMouseLeave={_.partial(this.unHighlightDate, this.props.date)} onClick={_.partial(this.selectDate, this.props.date)}>
        <AMState displayState={amDisplayState} availabilityAction={amAction} />
        <PMState displayState={pmDisplayState} availabilityAction={pmAction} />
        <span className="react-datepicker-date-label">{this.props.date.getDate()}</span>
      </td>
    );
  }

});

module.exports = RangeCalendarDate;
