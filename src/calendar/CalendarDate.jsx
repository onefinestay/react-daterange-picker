'use strict';

import React from 'react/addons';
import moment from 'moment-range';
import Immutable from 'immutable';

import BemMixin from '../utils/BemMixin';
import lightenDarkenColor from '../utils/lightenDarkenColor';

import CalendarDatePeriod from './CalendarDatePeriod';
import CalendarHighlight from './CalendarHighlight';
import CalendarSelection from './CalendarSelection';


const PureRenderMixin = React.addons.PureRenderMixin;
const cx = React.addons.classSet;


const CalendarDate = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  propTypes: {
    date: React.PropTypes.object.isRequired,

    firstOfMonth: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    maxIndex: React.PropTypes.number.isRequired,
    selectionType: React.PropTypes.string.isRequired,

    value: React.PropTypes.object,
    hideSelection: React.PropTypes.bool,
    highlightedRange: React.PropTypes.object,
    highlightedDate: React.PropTypes.object,
    selectedStartDate: React.PropTypes.object,
    dateStates: React.PropTypes.instanceOf(Immutable.List),

    onHighlightDate: React.PropTypes.func,
    onUnHighlightDate: React.PropTypes.func,
    onStartSelection: React.PropTypes.func,
    onCompleteSelection: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      hideSelection: false
    };
  },

  getInitialState() {
    return {
      mouseDown: false
    };
  },

  isDisabled(date) {
    return !this.props.enabledRange.contains(date);
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

  sanitizeRange(range, forwards) {
    /* Truncates the provided range at the first intersection
     * with a non-selectable state. Using forwards to determine
     * which direction to work
     */
    let blockedRanges = this.nonSelectableStateRanges().map(r => r.get('range'));
    let intersect;

    if (forwards) {
      intersect = blockedRanges.find(r => range.intersect(r));
      if (intersect) {
        return moment().range(range.start, intersect.start);
      }

    } else {
      intersect = blockedRanges.findLast(r => range.intersect(r));

      if (intersect) {
        return moment().range(intersect.end, range.end);
      }
    }

    if (range.start.isBefore(this.props.enabledRange.start)) {
      return moment().range(this.props.enabledRange.start, range.end);
    }

    if (range.end.isAfter(this.props.enabledRange.end)) {
      return moment().range(range.start, this.props.enabledRange.end);
    }

    return range;
  },

  mouseUp() {
    this.selectDate();

    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false
      });
    }
    document.removeEventListener('mouseup', this.mouseUp);
  },

  mouseDown() {
    this.setState({
      mouseDown: true
    });
    document.addEventListener('mouseup', this.mouseUp);
  },

  touchEnd() {
    this.highlightDate();
    this.selectDate();

    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false
      });
    }
    document.removeEventListener('touchend', this.touchEnd);
  },

  touchStart(event) {
    event.preventDefault();
    this.setState({
      mouseDown: true
    });
    document.addEventListener('touchend', this.touchEnd);
  },

  mouseEnter() {
    this.highlightDate();
  },

  mouseLeave() {
    if (this.state.mouseDown) {
      this.selectDate();

      this.setState({
        mouseDown: false
      });
    }
    this.unHighlightDate();
  },

  highlightDate() {
    let {date, selectionType, selectedStartDate, onHighlightRange, onHighlightDate} = this.props;
    let datePair;
    let range;
    let forwards;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        datePair = Immutable.List.of(selectedStartDate, date).sortBy(d  => d.unix());
        range = moment().range(datePair.get(0), datePair.get(1));
        forwards = (range.start.unix() === selectedStartDate.unix());
        range = this.sanitizeRange(range, forwards);
        onHighlightRange(range);
      } else if (!this.isDisabled(date) && this.isDateSelectable(date)) {
        onHighlightDate(date);
      }
    } else {
      if (!this.isDisabled(date) && this.isDateSelectable(date)) {
        onHighlightDate(date);
      }
    }
  },

  unHighlightDate() {
    this.props.onUnHighlightDate(this.props.date);
  },

  selectDate() {
    let {date, selectionType, selectedStartDate, completeRangeSelection, completeSelection, startRangeSelection} = this.props;
    let range;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        completeRangeSelection();
      } else if (!this.isDisabled(date) && this.isDateSelectable(date)) {
        startRangeSelection(date);
      }
    } else {
      if (!this.isDisabled(date) && this.isDateSelectable(date)) {
        completeSelection()
      }
    }
  },

  getBemModifiers() {
    let {date, firstOfMonth} = this.props;

    let otherMonth = false;
    let weekend = false;

    if (date.month() !== firstOfMonth.month()) {
      otherMonth = true;
    }

    if (date.day() === 0 || date.day() === 6) {
      weekend = true;
    }

    return {weekend, otherMonth};
  },

  getBemStates() {
    let {date, value, highlightedRange, highlightedDate, hideSelection} = this.props;
    let disabled = this.isDisabled(date);
    let highlighted = false;
    let selected = false;

    if (value && !hideSelection) {
      if (!value.start && date.isSame(value)) {
        selected = true;
      } else if (value.start && value.start.isSame(value.end) && date.isSame(value.start)) {
        selected = true;
      } else if (value.start && value.contains(date)) {
        selected = true;
      }
    }

    if (highlightedRange && highlightedRange.contains(date)) {
      highlighted = true;
    } else if (highlightedDate && date.isSame(highlightedDate)) {
      highlighted = true;
    }

    return {disabled, highlighted, selected};
  },

  render() {
    let {value, firstOfMonth, date, highlightedRange, highlightedDate, hideSelection} = this.props;

    let bemModifiers = this.getBemModifiers();
    let bemStates = this.getBemStates();

    let color;
    let amColor;
    let pmColor;
    let states = this.dateRangesForDate(date);
    let numStates = states.count();
    let cellStyle = {};
    let style = {};

    let highlightModifier = null;
    let selectionModifier = null;

    if (value && !hideSelection && value.start) {
      if (value.start.isSame(date) && value.start.isSame(value.end)) {
        selectionModifier = 'single';
      } else if (value.contains(date)) {
        if (date.isSame(value.start)) {
          selectionModifier = 'start';
        } else if (date.isSame(value.end)) {
          selectionModifier = 'end';
        } else {
          selectionModifier = 'segment';
        }
      }
    } else if (value && !hideSelection && date.isSame(value)) {
      selectionModifier = 'single';
    }

    if (highlightedRange && highlightedRange.contains(date)) {
      if (date.isSame(highlightedRange.start)) {
        highlightModifier = 'start';
      } else if (date.isSame(highlightedRange.end)) {
        highlightModifier = 'end';
      } else {
        highlightModifier = 'segment';
      }
    }

    if (highlightedDate && date.isSame(highlightedDate)) {
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
        onTouchStart={this.touchStart}
        onMouseOver={this.mouseOver}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        onMouseDown={this.mouseDown}>
        {numStates > 1 &&
          <div className={this.cx({element: "HalfDateStates"})}>
            <CalendarDatePeriod period="am" color={amColor} />
            <CalendarDatePeriod period="pm" color={pmColor} />
          </div>}
        {numStates === 1 &&
          <div className={this.cx({element: "FullDateStates"})} style={style} />}
        <span className={this.cx({element: "DateLabel"})}>{date.format('D')}</span>
        {selectionModifier && <CalendarSelection modifier={selectionModifier} />}
        {highlightModifier && <CalendarHighlight modifier={highlightModifier} />}
      </td>
    );
  }

});

export default CalendarDate;
