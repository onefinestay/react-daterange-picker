import React from 'react';

import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import moment from './moment-range';
import Immutable from 'immutable';
import calendar from 'calendar';

import BemMixin from './utils/BemMixin';
import CustomPropTypes from './utils/CustomPropTypes';
import Legend from './Legend';

import CalendarMonth from './calendar/CalendarMonth';
import CalendarDate from './calendar/CalendarDate';

import PaginationArrow from './PaginationArrow';

import isMomentRange from './utils/isMomentRange';
import hasUpdatedValue from './utils/hasUpdatedValue';
import { getYearMonth, getYearMonthProps } from './utils/getYearMonth';

import PureRenderMixin from 'react-addons-pure-render-mixin';

const absoluteMinimum = moment(new Date(-8640000000000000 / 2)).startOf('day');
const absoluteMaximum = moment(new Date(8640000000000000 / 2)).startOf('day');

function noop() {}

const DateRangePicker = createClass({
  mixins: [BemMixin, PureRenderMixin],
  displayName: "DateRangePicker",

  propTypes: {
    bemBlock: PropTypes.string,
    bemNamespace: PropTypes.string,
    className: PropTypes.string,
    dateStates: PropTypes.array, // an array of date ranges and their states
    defaultState: PropTypes.string,
    disableNavigation: PropTypes.bool,
    firstOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    helpMessage: PropTypes.string,
    initialDate: PropTypes.instanceOf(Date),
    initialFromValue: PropTypes.bool,
    initialMonth: PropTypes.number, // Overrides values derived from initialDate/initialRange
    initialRange: PropTypes.object,
    initialYear: PropTypes.number, // Overrides values derived from initialDate/initialRange
    locale: PropTypes.string,
    maximumDate: PropTypes.instanceOf(Date),
    minimumDate: PropTypes.instanceOf(Date),
    numberOfCalendars: PropTypes.number,
    onHighlightDate: PropTypes.func, // triggered when a date is highlighted (hovered)
    onHighlightRange: PropTypes.func, // triggered when a range is highlighted (hovered)
    onSelect: PropTypes.func, // triggered when a date or range is selectec
    onSelectStart: PropTypes.func, // triggered when the first date in a range is selected
    paginationArrowComponent: PropTypes.func,
    selectedLabel: PropTypes.string,
    selectionType: PropTypes.oneOf(['single', 'range']),
    singleDateRange: PropTypes.bool,
    showLegend: PropTypes.bool,
    stateDefinitions: PropTypes.object,
    value: CustomPropTypes.momentOrMomentRange,
  },

  getDefaultProps() {
    let date = new Date();
    let initialDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return {
      bemNamespace: null,
      bemBlock: 'DateRangePicker',
      className: '',
      numberOfCalendars: 1,
      firstOfWeek: 0,
      disableNavigation: false,
      nextLabel: '',
      previousLabel: '',
      initialDate: initialDate,
      initialFromValue: true,
      locale: moment().locale(),
      selectionType: 'range',
      singleDateRange: false,
      stateDefinitions: {
        '__default': {
          color: null,
          selectable: true,
          label: null,
        },
      },
      selectedLabel: "Your selected dates",
      defaultState: '__default',
      dateStates: [],
      showLegend: false,
      onSelect: noop,
      paginationArrowComponent: PaginationArrow,
    };
  },

  componentWillReceiveProps(nextProps) {
    const nextDateStates = this.getDateStates(nextProps);
    const nextEnabledRange = this.getEnabledRange(nextProps);

    const updatedState = {
      selectedStartDate: null,
      hideSelection: false,
      dateStates: this.state.dateStates && Immutable.is(this.state.dateStates, nextDateStates) ? this.state.dateStates : nextDateStates,
      enabledRange: this.state.enabledRange && this.state.enabledRange.isSame(nextEnabledRange) ? this.state.enabledRange : nextEnabledRange,
    };

    if (hasUpdatedValue(this.props, nextProps)) {
      if (!nextProps.value || !this.isStartOrEndVisible(nextProps)) {
        const yearMonth = getYearMonthProps(nextProps);

        updatedState.year = yearMonth.year;
        updatedState.month = yearMonth.month;
      }
    }

    this.setState(updatedState);
  },

  getInitialState() {
    let now = new Date();
    let {initialYear, initialMonth, initialFromValue, value} = this.props;
    let year = now.getFullYear();
    let month = now.getMonth();

    if (Number.isInteger(initialYear) && Number.isInteger(initialMonth)) {
      year = initialYear;
      month = initialMonth;
    }

    if (initialFromValue && (moment.isMoment(value) || isMomentRange(value))) {
      const yearMonth = getYearMonthProps(this.props);
      month = yearMonth.month;
      year = yearMonth.year;
    }

    return {
      year: year,
      month: month,
      selectedStartDate: null,
      highlightedDate: null,
      highlightRange: null,
      hideSelection: false,
      enabledRange: this.getEnabledRange(this.props),
      dateStates: this.getDateStates(this.props),
    };
  },

  getEnabledRange(props) {
    let min = props.minimumDate ? moment(props.minimumDate).startOf('day') : absoluteMinimum;
    let max = props.maximumDate ? moment(props.maximumDate).startOf('day') : absoluteMaximum;

    return moment.range(min, max);
  },

  getDateStates(props) {
    let {dateStates, defaultState, stateDefinitions} = props;
    let actualStates = [];
    let minDate = absoluteMinimum;
    let maxDate = absoluteMaximum;
    let dateCursor = moment(minDate).startOf('day');

    let defs = Immutable.fromJS(stateDefinitions);

    dateStates.forEach(function(s) {
      let r = s.range;
      let start = r.start.startOf('day');
      let end = r.end.startOf('day');

      if (!dateCursor.isSame(start, 'day')) {
        actualStates.push({
          state: defaultState,
          range: moment.range(
            dateCursor,
            start
          ),
        });
      }
      actualStates.push(s);
      dateCursor = end;
    });

    actualStates.push({
      state: defaultState,
      range: moment.range(
        dateCursor,
        maxDate
      ),
    });

    // sanitize date states
    return Immutable.List(actualStates).map(function(s) {
      let def = defs.get(s.state);
      return Immutable.Map({
        range: s.range,
        state: s.state,
        selectable: def.get('selectable', true),
        color: def.get('color'),
      });
    });
  },

  isDateDisabled(date) {
    return !this.state.enabledRange.contains(date);
  },

  isDateSelectable(date) {
    return this.dateRangesForDate(date).some(r => r.get('selectable'));
  },

  nonSelectableStateRanges() {
    return this.state.dateStates.filter(d => !d.get('selectable'));
  },

  dateRangesForDate(date) {
    return this.state.dateStates.filter(d => d.get('range').contains(date));
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
        return moment.range(range.start, intersect.start);
      }

    } else {
      intersect = blockedRanges.findLast(r => range.intersect(r));

      if (intersect) {
        return moment.range(intersect.end, range.end);
      }
    }

    if (range.start.isBefore(this.state.enabledRange.start)) {
      return moment.range(this.state.enabledRange.start, range.end);
    }

    if (range.end.isAfter(this.state.enabledRange.end)) {
      return moment.range(range.start, this.state.enabledRange.end);
    }

    return range;
  },

  highlightRange(range) {
    this.setState({
      highlightedRange: range,
      highlightedDate: null,
    });
    if (typeof this.props.onHighlightRange === 'function') {
      this.props.onHighlightRange(range, this.statesForRange(range));
    }
  },

  onUnHighlightDate() {
    this.setState({
      highlightedDate: null,
    });
  },

  onSelectDate(date) {
    let {selectionType} = this.props;
    let {selectedStartDate} = this.state;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        this.completeRangeSelection();
      } else if (date && !this.isDateDisabled(date) && this.isDateSelectable(date)) {
        this.startRangeSelection(date);
        if (this.props.singleDateRange) {
          this.highlightRange(moment.range(date, date));
        }
      }

    } else {
      if (!this.isDateDisabled(date) && this.isDateSelectable(date)) {
        this.completeSelection();
      }
    }
  },

  onHighlightDate(date) {
    let {selectionType} = this.props;
    let {selectedStartDate} = this.state;

    let datePair;
    let range;
    let forwards;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        datePair = Immutable.List.of(selectedStartDate, date).sortBy(d => d.unix());
        range = moment.range(datePair.get(0), datePair.get(1));
        forwards = (range.start.unix() === selectedStartDate.unix());
        range = this.sanitizeRange(range, forwards);
        this.highlightRange(range);
      } else if (!this.isDateDisabled(date) && this.isDateSelectable(date)) {
        this.highlightDate(date);
      }
    } else {
      if (!this.isDateDisabled(date) && this.isDateSelectable(date)) {
        this.highlightDate(date);
      }
    }
  },

  startRangeSelection(date) {
    this.setState({
      hideSelection: true,
      selectedStartDate: date,
    });
    if (typeof this.props.onSelectStart === 'function') {
      this.props.onSelectStart(moment(date));
    }
  },

  statesForDate(date) {
    return this.state.dateStates.filter(d => date.within(d.get('range'))).map(d => d.get('state'));
  },

  statesForRange(range) {
    if (range.start.isSame(range.end, 'day')) {
      return this.statesForDate(range.start);
    }
    return this.state.dateStates.filter(d => d.get('range').intersect(range)).map(d => d.get('state'));
  },

  completeSelection() {
    let highlightedDate = this.state.highlightedDate;
    if (highlightedDate) {
      this.setState({
        hideSelection: false,
        highlightedDate: null,
      });
      this.props.onSelect(highlightedDate, this.statesForDate(highlightedDate));
    }
  },

  completeRangeSelection() {
    let range = this.state.highlightedRange;

    if (range && (!range.start.isSame(range.end, 'day') || this.props.singleDateRange)) {
      this.setState({
        selectedStartDate: null,
        highlightedRange: null,
        highlightedDate: null,
        hideSelection: false,
      });
      this.props.onSelect(range, this.statesForRange(range));
    }
  },

  highlightDate(date) {
    this.setState({
      highlightedDate: date,
    });
    if (typeof this.props.onHighlightDate === 'function') {
      this.props.onHighlightDate(date, this.statesForDate(date));
    }
  },

  getMonthDate() {
    return moment(new Date(this.state.year, this.state.month, 1));
  },

  isStartOrEndVisible(props) {
    const { value, selectionType, numberOfCalendars } = props;

    const isVisible = (date) => {
      const yearMonth = getYearMonth(date);
      const isSameYear = (yearMonth.year === this.state.year);
      const isMonthVisible = (yearMonth.month === this.state.month) || (numberOfCalendars === 2 && (yearMonth.month - 1 === this.state.month));

      return isSameYear && isMonthVisible;
    };

    if (selectionType === 'single') {
      return isVisible(value);
    }

    return isVisible(value.start) || isVisible(value.end);
  },

  canMoveBack() {
    if (this.getMonthDate().subtract(1, 'days').isBefore(this.state.enabledRange.start)) {
      return false;
    }
    return true;
  },

  moveBack() {
    let monthDate;

    if (this.canMoveBack()) {
      monthDate = this.getMonthDate();
      monthDate.subtract(1, 'months');
      this.setState(getYearMonth(monthDate));
    }
  },

  canMoveForward() {
    if (this.getMonthDate().add(this.props.numberOfCalendars, 'months').isAfter(this.state.enabledRange.end)) {
      return false;
    }
    return true;
  },

  moveForward() {
    let monthDate;

    if (this.canMoveForward()) {
      monthDate = this.getMonthDate();
      monthDate.add(1, 'months');
      this.setState(getYearMonth(monthDate));
    }
  },

  changeYear(year) {
    let {enabledRange, month} = this.state;

    if (moment({years: year, months: month, date: 1}).unix() < enabledRange.start.unix()) {
      month = enabledRange.start.month();
    }

    if (moment({years: year, months: month + 1, date: 1}).unix() > enabledRange.end.unix()) {
      month = enabledRange.end.month();
    }

    this.setState({
      year: year,
      month: month,
    });
  },

  changeMonth(date) {
    this.setState({
      month: date,
    });
  },

  rangesOverlap(rangeA, rangeB) {
    if (rangeA.overlaps(rangeB) || rangeA.contains(rangeB.start) || rangeA.contains(rangeB.end)) {
      return true;
    }
    return false;
  },

  renderCalendar(index) {
    let {
      bemBlock,
      bemNamespace,
      firstOfWeek,
      numberOfCalendars,
      selectionType,
      value,
    } = this.props;

    let {
      dateStates,
      enabledRange,
      hideSelection,
      highlightedDate,
      highlightedRange,
    } = this.state;
    let monthDate = this.getMonthDate();
    let year = monthDate.year();
    let month = monthDate.month();
    let key = `${ index}-${ year }-${ month }`;
    let props;

    monthDate.add(index, 'months');

    let cal = new calendar.Calendar(firstOfWeek);
    let monthDates = Immutable.fromJS(cal.monthDates(monthDate.year(), monthDate.month()));
    let monthStart = monthDates.first().first();
    let monthEnd = monthDates.last().last();
    let monthRange = moment.range(monthStart, monthEnd);

    if (moment.isMoment(value) && !monthRange.contains(value)) {
      value = null;
    } else if (isMomentRange(value) && !(this.rangesOverlap(monthRange, value))) {
      value = null;
    }

    if (!moment.isMoment(highlightedDate) || !monthRange.contains(highlightedDate)) {
      highlightedDate = null;
    }

    if (!isMomentRange(highlightedRange) || !(this.rangesOverlap(monthRange, highlightedRange))) {
      highlightedRange = null;
    }

    props = {
      bemBlock,
      bemNamespace,
      dateStates,
      enabledRange,
      firstOfWeek,
      hideSelection,
      highlightedDate,
      highlightedRange,
      index,
      key,
      selectionType,
      value,
      maxIndex: numberOfCalendars - 1,
      firstOfMonth: monthDate,
      onMonthChange: this.changeMonth,
      onYearChange: this.changeYear,
      onSelectDate: this.onSelectDate,
      onHighlightDate: this.onHighlightDate,
      onUnHighlightDate: this.onUnHighlightDate,
      dateRangesForDate: this.dateRangesForDate,
      dateComponent: CalendarDate,
      locale: this.props.locale,
    };

    return <CalendarMonth {...props} />;
  },

  render: function() {
    let {paginationArrowComponent: PaginationArrowComponent, className, numberOfCalendars, stateDefinitions, selectedLabel, showLegend, helpMessage} = this.props;

    let calendars = Immutable.Range(0, numberOfCalendars).map(this.renderCalendar);
    className = this.cx({element: null}) + ' ' + className;

    return (
      <div className={className.trim()}>
        <PaginationArrowComponent direction="previous" onTrigger={this.moveBack} disabled={!this.canMoveBack()} />
        {calendars.toJS()}
        <PaginationArrowComponent direction="next" onTrigger={this.moveForward} disabled={!this.canMoveForward()} />
        {helpMessage ? <span className={this.cx({element: 'HelpMessage'})}>{helpMessage}</span> : null}
        {showLegend ? <Legend stateDefinitions={stateDefinitions} selectedLabel={selectedLabel} /> : null}
      </div>
    );
  },
});

export default DateRangePicker;
