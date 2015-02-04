'use strict';

import React from 'react/addons';
import moment from 'moment-range';
import Immutable from 'immutable';

import BemMixin from '../utils/BemMixin';
import lightenDarkenColor from '../utils/lightenDarkenColor';

import CalendarDatePeriod from './CalendarDatePeriod';
import CalendarHighlight from './CalendarHighlight';
import CalendarSelection from './CalendarSelection';


var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var RangeDate = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

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
    var {firstOfMonth, maxIndex, minDate, maxDate} = this.props;

    var y = firstOfMonth.getFullYear();
    var m = firstOfMonth.getMonth();

    if (date.getMonth() !== m) {
      if (
        this.props.index < maxIndex &&
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

    if (minDate && date.getTime() < minDate.getTime()) {
      return true;
    }
    if (maxDate && date.getTime() > maxDate.getTime()) {
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
    var {date, selectionType, selectedStartDate, onHighlightRange, onHighlightDate} = this.props;
    var datePair;
    var range;
    var forwards;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        datePair = Immutable.List.of(selectedStartDate, date).sortBy(d  => d.getTime());
        range = moment().range(datePair.get(0), datePair.get(1));
        forwards = (range.start.toDate().getTime() === selectedStartDate.getTime());
        range = this.sanitizeRange(range, forwards);
        onHighlightRange(range);
      } else {
        onHighlightDate(date);
      }
    } else {
      if (!this.isDisabled(date)) {
        onHighlightDate(date);
      }
    }
  },

  unHighlightDate() {
    this.props.onUnHighlightDate(this.props.date);
  },

  selectDate() {
    var {date, selectionType, selectedStartDate, onCompleteSelection, onStartSelection, onSelect} = this.props;
    var datePair;
    var range;
    var forwards;
    var states;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        // We already have one end of the range
        datePair = Immutable.List.of(selectedStartDate, date).sortBy(d  => d.getTime());
        range = moment().range(datePair.get(0), datePair.get(1));
        forwards = range.start.toDate().getTime() === selectedStartDate.getTime();

        range = this.sanitizeRange(range, forwards);

        if (range && range.end.diff(range.start, 'days') > 0) {
          states = this.statesForRange(range);
          onCompleteSelection(range, states);
        }
      } else if (this.isDateSelectable(date)) {
        onStartSelection(date);
      }
    } else {
      if (!this.isDisabled(date)) {
        onSelect(date);
      }
    }
  },

  getBemModifiers() {
    var {date, firstOfMonth} = this.props;

    var otherMonth = false;
    var weekend = false;

    if (date.getMonth() !== firstOfMonth.getMonth()) {
      otherMonth = true;
    }

    if (date.getDay() === 0 || date.getDay() === 6) {
      weekend = true;
    }

    return {weekend, otherMonth};
  },

  getBemStates() {
    var {date, value, highlightedRange, highlightedDate} = this.props;
    var dateMoment = moment(date);
    var disabled = this.isDisabled(date);
    var highlighted = false;
    var selected = false;

    if (value) {
      if (!value.start && dateMoment.isSame(value)) {
        selected = true;
      } else if (value.start && value.start.isSame(value.end) && dateMoment.isSame(value.start)) {
        selected = true;
      } else if (value.start && value.contains(dateMoment)) {
        selected = true;
      }
    }

    if (highlightedRange && highlightedRange.contains(dateMoment)) {
      highlighted = true;
    } else if (highlightedDate && dateMoment.isSame(highlightedDate)) {
      highlighted = true;
    }

    return {disabled, highlighted, selected};
  },

  render() {
    var {value, firstOfMonth, date, highlightedRange, highlightedDate} = this.props;
    var dateMoment = moment(date);

    var bemModifiers = this.getBemModifiers();
    var bemStates = this.getBemStates();

    var color;
    var amColor;
    var pmColor;
    var states = this.dateRangesForDate(date);
    var numStates = states.count();
    var cellStyle = {};
    var style = {};

    var highlightModifier = null;
    var selectionModifier = null;

    if (value && value.start) {
      if (value.start.isSame(value.end)) {
        selectionModifier = 'single';
      } else if (value.contains(dateMoment)) {
        if (dateMoment.isSame(value.start)) {
          selectionModifier = 'start';
        } else if (dateMoment.isSame(value.end)) {
          selectionModifier = 'end';
        } else {
          selectionModifier = 'segment';
        }
      }
    } else if (value && dateMoment.isSame(value)) {
      selectionModifier = 'single';
    }

    if (highlightedRange && highlightedRange.contains(dateMoment)) {
      if (dateMoment.isSame(highlightedRange.start)) {
        highlightModifier = 'start';
      } else if (dateMoment.isSame(highlightedRange.end)) {
        highlightModifier = 'end';
      } else {
        highlightModifier = 'segment';
      }
    }

    if (highlightedDate && dateMoment.isSame(highlightedDate)) {
      highlightModifier = 'single';
    }

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

    return (
      <td className={this.cx({element: 'Date', modifiers: bemModifiers, states: bemStates})}
        style={cellStyle}
        onMouseEnter={this.highlightDate}
        onMouseLeave={this.unHighlightDate}
        onClick={this.selectDate}>
        {numStates > 1 &&
          <div className={this.cx({element: "HalfDateStates"})}>
            <CalendarDatePeriod period="am" color={amColor} />
            <CalendarDatePeriod period="pm" color={pmColor} />
          </div>}
        {numStates === 1 &&
          <div className={this.cx({element: "FullDateStates"})} style={style} />}
        <span className={this.cx({element: "DateLabel"})}>{dateMoment.format('D')}</span>
        {selectionModifier && <CalendarSelection modifier={selectionModifier} />}
        {highlightModifier && <CalendarHighlight modifier={highlightModifier} />}
      </td>
    );
  }

});

export default RangeDate;
