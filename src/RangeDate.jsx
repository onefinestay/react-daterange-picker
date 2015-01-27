'use strict';

import React from 'react/addons';
import moment from 'moment-range';
import _ from 'underscore';

import sortDates from './sortDates';

import AMState from './AMState';
import PMState from './PMState';

var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var RangeDate = React.createClass({
  mixins: [PureRenderMixin],

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

  isDisabled(date) {
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

  isDateSelectable(date) {
    var dateRanges = this.dateRangesForDate(date);
    var defaultState = this.props.defaultState;

    if (dateRanges.length === 0 && defaultState.selectable) {
      return true;
    } else {
      // if one date range and date is at the start or end of it then return
      // defaultState
      if (dateRanges.length === 1) {
        var state = dateRanges[0];
        var start = state.range.start.toDate();
        var end = state.range.end.toDate();
        if (
          start.getTime() == date.getTime() ||
          end.getTime() == date.getTime()
        ) {
          return defaultState.selectable === true;
        }
      }

      if (_.some(dateRanges, function(r) { return r.selectable; })) {
        return true;
      }
    }
    return false;
  },

  nonSelectableStateRanges() {
    return _.chain(this.props.dateStates)
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

  dateRangesForDate(date) {
    return _.filter(this.props.dateStates, function(dates) {
      if (dates.range.contains(date)) {
        return dates.range;
      }
    });
  },

  statesForRange(range) {
    return _.filter(this.props.dateStates, function(dates) {
      if (dates.range.intersect(range)) {
        return dates.state;
      }
    });
  },

  sanitizeRange(range, forwards) {
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

  highlightDate(date) {
    if (this.isDateSelectable(date)) {
      if (this.props.selectedStartDate) {
        var datePair = sortDates(this.props.selectedStartDate, date);
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

  unHighlightDate(date) {
    this.props.onUnHighlightDate(date);
  },

  selectDate(date) {
    if (this.props.selectedStartDate) {
      // We already have one end of the range
      var datePair = sortDates(this.props.selectedStartDate, date);
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

  getClasses(props) {
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

    return {
      'reactDaterangePicker__date': true,
      'reactDaterangePicker__date--is-selected': isSelected,
      'reactDaterangePicker__date--is-inSelectedRange': isSelectedRange,
      'reactDaterangePicker__date--is-highlighted': isHighlighted,
      'reactDaterangePicker__date--is-inHighlightedRange': isHighlightedRange,
      'reactDaterangePicker__date--is-disabled': isDisabled,
      'reactDaterangePicker__date--is-inOtherMonth': isOtherMonth
    };
  },

  getSegmentStates(props) {
    var date = props.date;
    var isDisabled = this.isDisabled(date);
    var isOtherMonth = false;
    var amDisplayStates = [];
    var pmDisplayStates = [];

    if (date.getMonth() !== props.firstOfMonth.getMonth()) {
      isOtherMonth = true;
    }

    if (isDisabled) {
      amDisplayStates.push('disabled');
      pmDisplayStates.push('disabled');
    }

    if (isOtherMonth) {
      amDisplayStates.push('inOtherMonth');
      pmDisplayStates.push('inOtherMonth');
    }

    if (props.value && props.value.contains(date)) {
      if (props.value.start.toDate().getTime() === date.getTime()) {
        // It's the first day in the range, so only PM is selected
        pmDisplayStates.push('selected');
      } else if (props.value.end.toDate().getTime() === date.getTime()) {
        // It's the last day in the range, so only AM is selected
        amDisplayStates.push('selected');
      } else {
        // It's somewhere in the range, so AM and PM are selected
        amDisplayStates.push('selected');
        pmDisplayStates.push('selected');
      }
    }

    if (props.highlightedRange && props.highlightedRange.contains(date)) {
      if (props.highlightedRange.start.toDate().getTime() === date.getTime()) {
        pmDisplayStates.push('highlighted');
      } else if (props.highlightedRange.end.toDate().getTime() === date.getTime()) {
        amDisplayStates.push('highlighted');
      } else {
        amDisplayStates.push('highlighted');
        pmDisplayStates.push('highlighted');
      }
    }

    if (
      props.highlightedDate &&
      !props.highlightedRange &&
      date.getTime() === props.highlightedDate.getTime()
    ) {
      amDisplayStates.push('highlighted');
      pmDisplayStates.push('highlighted');
    }

    return {
      am: amDisplayStates,
      pm: pmDisplayStates
    };
  },

  render() {
    var classes = this.getClasses(this.props);
    var date = this.props.date;
    var amAction;
    var pmAction;
    var states = this.dateRangesForDate(date);
    var defaultState = this.props.defaultState;
    var state;
    var start;
    var end;
    var segmentStates;

    if (states.length > 0) {
      if (states.length === 1) {
        // If there's only one state, it means we're not at a boundary
        state = states[0];
        start = state.range.start.toDate();
        end = state.range.end.toDate();

        if (!defaultState) {
          amAction = state.state;
          pmAction = state.state;
        } else {
          // start of range
          if (start.getTime() == date.getTime()) {
            amAction = defaultState.state;
            pmAction = state.state;
          } else if (end.getTime() == date.getTime()) {
            amAction = state.state;
            pmAction = defaultState.state;
          } else {
            amAction = state.state;
            pmAction = state.state;
          }
        }
      } else {
        amAction = states[0].state;
        pmAction = states[1].state;
      }
    } else if (defaultState && defaultState.state) {
      amAction = defaultState.state;
      pmAction = defaultState.state;
    }

    segmentStates = this.getSegmentStates(this.props);

    return (
      <td className={cx(classes)}
        onMouseEnter={_.partial(this.highlightDate, this.props.date)}
        onMouseLeave={_.partial(this.unHighlightDate, this.props.date)}
        onClick={_.partial(this.selectDate, this.props.date)}>
        <AMState displayStates={segmentStates.am} availabilityAction={amAction} />
        <PMState displayStates={segmentStates.pm} availabilityAction={pmAction} />
        <span className="reactDaterangePicker__dateLabel">{this.props.date.getDate()}</span>
      </td>
    );
  }

});

export default RangeDate;
