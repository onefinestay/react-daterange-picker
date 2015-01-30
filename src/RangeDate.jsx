'use strict';

import React from 'react/addons';
import moment from 'moment-range';
import Immutable from 'immutable';

import AMState from './AMState';
import PMState from './PMState';

import HighlightEnd from './HighlightEnd';
import HighlightSegment from './HighlightSegment';
import HighlightSingle from './HighlightSingle';
import HighlightStart from './HighlightStart';

import SelectionEnd from './SelectionEnd';
import SelectionSegment from './SelectionSegment';
import SelectionSingle from './SelectionSingle';
import SelectionStart from './SelectionStart';

import lightenDarkenColor from './lightenDarkenColor';


var PureRenderMixin = React.addons.PureRenderMixin;
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
    dateStates: React.PropTypes.instanceOf(Immutable.List),

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
    return this.dateRangesForDate(date).some(r => r.get('selectable'));
  },

  nonSelectableStateRanges() {
    return this.props.dateStates.filter(d => !d.get('selectable'));
  },

  dateRangesForDate(date) {
    return this.props.dateStates.filter(d => d.get('range').contains(date));
  },

  statesForRange(range) {
    return this.props.dateStates.filter(d => d.get('range').intersect(range)).map(d => d.get('state'));
  },

  sanitizeRange(range, forwards) {
    /* Truncates the provided range at the first intersection
     * with a non-selectable state. Using forwards to determine
     * which direction to work
     */
    var blockedRanges = this.nonSelectableStateRanges();
    var intersect;

    if (forwards) {
      intersect = blockedRanges.find(r => range.intersect(r.get('range')));
      if (intersect) {
        return moment().range(range.start, intersect.get('range').start);
      }

    } else {
      intersect = blockedRanges.findLast(r => range.intersect(r.get('range')));

      if (intersect) {
        return moment().range(intersect.get('range').end, range.end);
      }
    }
    return range;
  },

  highlightDate() {
    var date = this.props.date;
    var datePair;
    var range;
    var forwards;

    if (this.props.selectedStartDate) {
      datePair = Immutable.List.of(this.props.selectedStartDate, date).sortBy(d  => d.getTime());
      range = moment().range(datePair.get(0), datePair.get(1));
      forwards = (range.start.toDate().getTime() === this.props.selectedStartDate.getTime());
      range = this.sanitizeRange(range, forwards);
      this.props.onHighlightRange(range);
    } else {
      this.props.onHighlightDate(date);
    }
  },

  unHighlightDate() {
    this.props.onUnHighlightDate(this.props.date);
  },

  selectDate() {
    var date = this.props.date;
    var datePair;
    var range;
    var forwards;
    var states;

    if (this.props.selectedStartDate) {
      // We already have one end of the range
      datePair = Immutable.List.of(this.props.selectedStartDate, date).sortBy(d  => d.getTime());
      range = moment().range(datePair.get(0), datePair.get(1));
      forwards = range.start.toDate().getTime() === this.props.selectedStartDate.getTime();

      range = this.sanitizeRange(range, forwards);

      if (range && range.end.diff(range.start, 'days') > 0) {
        states = this.statesForRange(range);
        this.props.onCompleteSelection(range, states);
      }
    } else if (this.isDateSelectable(date)) {
      this.props.onStartSelection(date);
    }
  },

  getClasses(props) {
    var date = props.date;
    var isOtherMonth = false;
    var isWeekend = false;
    var isDisabled = this.isDisabled(date);

    if (date.getMonth() !== props.firstOfMonth.getMonth()) {
      isOtherMonth = true;
    }

    if (date.getDay() === 0 || date.getDay() === 6) {
      isWeekend = true;
    }


    return {
      'reactDaterangePicker__date': true,
      'reactDaterangePicker__date--is-disabled': isDisabled,
      'reactDaterangePicker__date--is-weekend': isWeekend,
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
      am: Immutable.List(amDisplayStates),
      pm: Immutable.List(pmDisplayStates)
    };
  },

  render() {
    var classes = this.getClasses(this.props);
    var date = moment(this.props.date);
    var color;
    var amColor;
    var pmColor;
    var states = this.dateRangesForDate(date);
    var numStates = states.count();
    var cellStyle = {};
    var style = {};
    var inSelection = false;
    var inHighlight = false;
    var isInOtherMonth = this.props.date.getMonth() !== this.props.firstOfMonth.getMonth();


    var HighlightComponent = null;
    var SelectionComponent = null;

    if (this.props.value) {
      if (!this.props.value.start) {
        if (date.isSame(this.props.value)) {
          SelectionComponent = SelectionSingle;
          inSelection = true;
        }
      } else if (this.props.value.start.isSame(this.props.value.end)) {
        if (date.isSame(this.props.value.start)) {
          SelectionComponent = SelectionSingle;
          inSelection = true;
        }
      } else {
        // It's a range
        if (this.props.value.contains(date)) {
          if (date.isSame(this.props.value.start)) {
            SelectionComponent = SelectionStart;
            inSelection = true;
          } else if (date.isSame(this.props.value.end)) {
            SelectionComponent = SelectionEnd;
            inSelection = true;
          } else {
            SelectionComponent = SelectionSegment;
            inSelection = true;
          }
        }
      }
    }

    if (this.props.highlightedRange && this.props.highlightedRange.contains(date)) {
      if (date.isSame(this.props.highlightedRange.start)) {
        HighlightComponent = HighlightStart;
        inHighlight = true;
      } else if (date.isSame(this.props.highlightedRange.end)) {
        HighlightComponent = HighlightEnd;
        inHighlight = true;
      } else {
        HighlightComponent = HighlightSegment;
        inHighlight = true;
      }
    }

    if (this.props.highlightedDate && date.isSame(this.props.highlightedDate)) {
      HighlightComponent = HighlightSingle;
      inHighlight = true;
    }

    if (inHighlight) {
      classes['reactDaterangePicker__date--is-inHighlight'] = true;
    }

    if (inSelection) {
      classes['reactDaterangePicker__date--is-inSelection'] = true;
    }

    if (!isInOtherMonth) {
      if (numStates === 1) {
        // If there's only one state, it means we're not at a boundary
        color = states.getIn([0, 'color']);

        if (color) {

          style = {
            backgroundColor: color
          };
          cellStyle = {
            borderLeftColor: lightenDarkenColor(color, -10),
            borderRightColor: lightenDarkenColor(color, -10)
          };
        }
      } else {
        amColor = states.getIn([0, 'color']);
        pmColor = states.getIn([1, 'color']);

        if (amColor) {
          cellStyle['borderLeftColor'] = lightenDarkenColor(amColor, -10);
        }

        if (pmColor) {
          cellStyle['borderRightColor'] = lightenDarkenColor(pmColor, -10);
        }
      }
    }

    return (
      <td className={cx(classes)}
        style={cellStyle}
        onMouseEnter={this.highlightDate}
        onMouseLeave={this.unHighlightDate}
        onClick={this.selectDate}>
        {!isInOtherMonth && numStates > 1 &&
          <div className="reactDaterangePicker__halfDateStates">
            <AMState color={amColor} />
            <PMState color={pmColor} />
          </div>}
        {!isInOtherMonth && numStates === 1 &&
          <div className="reactDaterangePicker__fullDateStates" style={style} />}
        <span className="reactDaterangePicker__dateLabel">{date.format('D')}</span>
        {SelectionComponent && <SelectionComponent date={date} isInOtherMonth={isInOtherMonth} />}
        {HighlightComponent && <HighlightComponent date={date} isInOtherMonth={isInOtherMonth} />}
      </td>
    );
  }

});

export default RangeDate;
