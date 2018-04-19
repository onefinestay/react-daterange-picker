import React from 'react';

import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import Immutable from 'immutable';

import BemMixin from '../utils/BemMixin';
import CustomPropTypes from '../utils/CustomPropTypes';
import PureRenderMixin from '../utils/PureRenderMixin';
import lightenDarkenColor from '../utils/lightenDarkenColor';

import CalendarDatePeriod from './CalendarDatePeriod';
import CalendarHighlight from './CalendarHighlight';
import CalendarSelection from './CalendarSelection';


const CalendarDate = createClass({
  mixins: [BemMixin, PureRenderMixin],
  displayName: "CalendarDate",

  propTypes: {
    date: CustomPropTypes.moment,

    firstOfMonth: PropTypes.object.isRequired,

    isSelectedDate: PropTypes.bool,
    isSelectedRangeStart: PropTypes.bool,
    isSelectedRangeEnd: PropTypes.bool,
    isInSelectedRange: PropTypes.bool,

    isHighlightedDate: PropTypes.bool,
    isHighlightedRangeStart: PropTypes.bool,
    isHighlightedRangeEnd: PropTypes.bool,
    isInHighlightedRange: PropTypes.bool,

    highlightedDate: PropTypes.object,
    dateStates: PropTypes.instanceOf(Immutable.List),
    isDisabled: PropTypes.bool,
    isToday: PropTypes.bool,

    dateRangesForDate: PropTypes.func,
    onHighlightDate: PropTypes.func,
    onUnHighlightDate: PropTypes.func,
    onSelectDate: PropTypes.func,
  },

  getInitialState() {
    return {
      mouseDown: false,
    };
  },

  componentWillUnmount() {
    this.isUnmounted = true;
    document.removeEventListener('mouseup', this.mouseUp);
    document.removeEventListener('touchend', this.touchEnd);
  },

  mouseUp() {
    this.props.onSelectDate(this.props.date);

    if (this.isUnmounted) {
      return;
    }

    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false,
      });
    }

    document.removeEventListener('mouseup', this.mouseUp);
  },

  mouseDown() {
    this.setState({
      mouseDown: true,
    });

    document.addEventListener('mouseup', this.mouseUp);
  },

  touchEnd() {
    event.preventDefault();
    this.props.onHighlightDate(this.props.date);
    this.props.onSelectDate(this.props.date);

    if (this.isUnmounted) {
      return;
    }

    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false,
      });
    }
    document.removeEventListener('touchend', this.touchEnd);
  },

  touchStart(event) {
    event.preventDefault();
    this.setState({
      mouseDown: true,
    });
    document.addEventListener('touchend', this.touchEnd);
  },

  mouseEnter() {
    this.props.onHighlightDate(this.props.date);
  },

  mouseLeave() {
    if (this.state.mouseDown) {
      this.props.onSelectDate(this.props.date);

      this.setState({
        mouseDown: false,
      });
    }
    this.props.onUnHighlightDate(this.props.date);
  },

  getBemModifiers() {
    let {date, firstOfMonth, isToday: today} = this.props;

    let otherMonth = false;
    let weekend = false;

    if (date.month() !== firstOfMonth.month()) {
      otherMonth = true;
    }

    if (date.day() === 0 || date.day() === 6) {
      weekend = true;
    }

    return {today, weekend, otherMonth};
  },

  getBemStates() {
    let {
      isSelectedDate,
      isInSelectedRange,
      isInHighlightedRange,
      isHighlightedDate: highlighted,
      isDisabled: disabled,
    } = this.props;

    let selected = isSelectedDate || isInSelectedRange || isInHighlightedRange;

    return {disabled, highlighted, selected};
  },

  render() {
    let {
      date,
      dateRangesForDate,
      isSelectedDate,
      isSelectedRangeStart,
      isSelectedRangeEnd,
      isInSelectedRange,
      isHighlightedDate,
      isHighlightedRangeStart,
      isHighlightedRangeEnd,
      isInHighlightedRange,
    } = this.props;

    let bemModifiers = this.getBemModifiers();
    let bemStates = this.getBemStates();
    let pending = isInHighlightedRange;

    let color;
    let amColor;
    let pmColor;
    let states = dateRangesForDate(date);
    let numStates = states.count();
    let cellStyle = {};
    let style = {};

    let highlightModifier;
    let selectionModifier;

    if (isSelectedDate || (isSelectedRangeStart && isSelectedRangeEnd)
        || (isHighlightedRangeStart && isHighlightedRangeEnd)) {
      selectionModifier = 'single';
    } else if (isSelectedRangeStart || isHighlightedRangeStart) {
      selectionModifier = 'start';
    } else if (isSelectedRangeEnd || isHighlightedRangeEnd) {
      selectionModifier = 'end';
    } else if (isInSelectedRange || isInHighlightedRange) {
      selectionModifier = 'segment';
    }

    if (isHighlightedDate) {
      highlightModifier = 'single';
    }

    if (numStates === 1) {
      // If there's only one state, it means we're not at a boundary
      color = states.getIn([0, 'color']);

      if (color) {

        style = {
          backgroundColor: color,
        };
        cellStyle = {
          borderLeftColor: lightenDarkenColor(color, -10),
          borderRightColor: lightenDarkenColor(color, -10),
        };
      }
    } else {
      amColor = states.getIn([0, 'color']);
      pmColor = states.getIn([1, 'color']);

      if (amColor) {
        cellStyle.borderLeftColor = lightenDarkenColor(amColor, -10);
      }

      if (pmColor) {
        cellStyle.borderRightColor = lightenDarkenColor(pmColor, -10);
      }
    }

    return (
      <td className={this.cx({element: 'Date', modifiers: bemModifiers, states: bemStates})}
        style={cellStyle}
        onTouchStart={this.touchStart}
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
        {selectionModifier ? <CalendarSelection modifier={selectionModifier} pending={pending} /> : null}
        {highlightModifier ? <CalendarHighlight modifier={highlightModifier} /> : null}
      </td>
    );
  },
});

export default CalendarDate;
