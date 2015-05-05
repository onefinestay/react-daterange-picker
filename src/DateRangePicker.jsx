'use strict';
import React from 'react/addons';
import moment from 'moment';
import Immutable from 'immutable';

import BemMixin from './utils/BemMixin';
import Legend from './Legend';

import CalendarMonth from './calendar/CalendarMonth';
import CalendarDate from './calendar/CalendarDate';

import PaginationArrow from './PaginationArrow';

var PureRenderMixin = React.addons.PureRenderMixin;

var absoluteMinimum = moment(new Date(-8640000000000000 / 2)).startOf('day');
var absoluteMaximum = moment(new Date(8640000000000000 / 2)).startOf('day');

React.initializeTouchEvents(true);

function noop () {}


var DateRangePicker = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  propTypes: {
    bemBlock: React.PropTypes.string,
    bemNamespace: React.PropTypes.string,
    dateStates: React.PropTypes.array, // an array of date ranges and their states
    defaultState: React.PropTypes.string,
    disableNavigation: React.PropTypes.bool,
    firstOfWeek: React.PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    initialDate: React.PropTypes.instanceOf(Date),
    initialFromValue: React.PropTypes.bool,
    initialMonth: React.PropTypes.number, // Overrides values derived from initialDate/initialRange
    initialRange: React.PropTypes.object,
    initialYear: React.PropTypes.number, // Overrides values derived from initialDate/initialRange
    maximumDate: React.PropTypes.instanceOf(Date),
    minimumDate: React.PropTypes.instanceOf(Date),
    numberOfCalendars: React.PropTypes.number,
    onHighlightDate: React.PropTypes.func, // triggered when a date is highlighted (hovered)
    onHighlightRange: React.PropTypes.func, // triggered when a range is highlighted (hovered)    
    onSelect: React.PropTypes.func, // triggered when a date or range is selectec
    onSelectStart: React.PropTypes.func, // triggered when the first date in a range is selected
    paginationArrowComponent: React.PropTypes.func,
    selectedLabel: React.PropTypes.string,
    selectionType: React.PropTypes.oneOf(['single', 'range']),
    showLegend: React.PropTypes.bool,
    stateDefinitions: React.PropTypes.object,
    value: function(props, propName, componentName) {
      var val = props[propName];

      if (!val) {
        return
      } else if (moment.isMoment(val)) {
        return;
      } else if (val.start && val.end && moment.isMoment(val.start) && moment.isMoment(val.end)) {
        return;
      }
      return new Error('Value must be a moment or a moment range');
    }
  },

  getDefaultProps() {
    var date = new Date();
    var initialDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return {
      bemNamespace: null,
      bemBlock: 'DateRangePicker',
      numberOfCalendars: 1,
      firstOfWeek: 0,
      disableNavigation: false,
      nextLabel: '',
      previousLabel: '',
      initialDate: initialDate,
      initialFromValue: true,
      selectionType: 'range',
      stateDefinitions: {
        '__default': {
          color: null,
          selectable: true,
          label: null
        }
      },
      selectedLabel: "Your selected dates",
      defaultState: '__default',
      dateStates: [],
      showLegend: false,
      onSelect: noop,
      paginationArrowComponent: PaginationArrow
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dateStates: this.getDateStates(nextProps),
      enabledRange: this.getEnabledRange(nextProps)
    });
  },

  getInitialState() {
    var {initialYear, initialMonth, initialFromValue, selectionType, value} = this.props;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();

    if (initialYear && initialMonth) {
      year = initialYear;
      month = initialMonth;
    }

    if (initialFromValue && value) {
      if (selectionType === 'single') {
        year = value.year();
        month = value.month();
      } else {
        year = value.start.year();
        month = value.start.month();
      }
    }

    return {
      year: year,
      month: month,
      selectedStartDate: null,
      highlightStartDate: null,
      highlightedDate: null,
      highlightRange: null,
      hideSelection: false,
      enabledRange: this.getEnabledRange(this.props),
      dateStates: this.getDateStates(this.props)
    };
  },

  getEnabledRange(props) {
    var min = props.minimumDate ? moment(props.minimumDate).startOf('day') : absoluteMinimum;
    var max = props.maximumDate  ? moment(props.maximumDate).startOf('day') : absoluteMaximum;

    return moment().range(min, max);
  },

  getDateStates(props) {
    var {dateStates, defaultState, stateDefinitions} = props;
    var actualStates = [];
    var minDate = absoluteMinimum;
    var maxDate = absoluteMaximum;
    var dateCursor = moment(minDate).startOf('day');

    var defs = Immutable.fromJS(stateDefinitions);

    dateStates.forEach(function(s) {
      var r = s.range;
      var start = r.start.startOf('day');
      var end = r.end.startOf('day');

      if (!dateCursor.isSame(start)) {
        actualStates.push({
          state: defaultState,
          range: moment().range(
            dateCursor,
            start
          )
        });
      }
      actualStates.push(s);
      dateCursor = end;
    }.bind(this));

    actualStates.push({
      state: defaultState,
      range: moment().range(
        dateCursor,
        maxDate
      )
    });

    // sanitize date states
    return Immutable.List(actualStates).map(function(s) {
      var def = defs.get(s.state);
      return Immutable.Map({
        range: s.range,
        state: s.state,
        selectable: def.get('selectable', true),
        color: def.get('color')
      });
    }.bind(this));
  },

  onSelect(date) {
    this.props.onSelect(moment(date));
  },

  startRangeSelection(date) {
    this.setState({
      hideSelection: true,
      selectedStartDate: date
    });
    if (typeof(this.props.onSelectStart) === 'function') { 
      this.props.onSelectStart(moment(date));
    }
  },

  statesForRange(range) {
    if (range.start.isSame(range.end)) {
      return this.state.dateStates.filter(d => range.start.within(d.get('range'))).map(d => d.get('state'));
    }
    return this.state.dateStates.filter(d => d.get('range').intersect(range)).map(d => d.get('state'));
  },

  completeSelection() {
    var highlightedDate = this.state.highlightedDate;
    if (highlightedDate) {
      this.setState({
        hideSelection: false,
        highlightedDate: null
      });
      this.props.onSelect(highlightedDate);
    }
  },

  completeRangeSelection() {
    var range = this.state.highlightedRange;
    if (range && !range.start.isSame(range.end)) {
      this.setState({
        selectedStartDate: null,
        highlightedRange: null,
        highlightedDate: null,
        hideSelection: false
      });
      this.props.onSelect(range, this.statesForRange(range));
    }
  },

  onHighlightDate(date) {
    this.setState({
      highlightedDate: date,
    });
    if (typeof(this.props.onHighlightDate) === 'function') { 
      this.props.onHighlightDate(moment(date));
    }
  },

  onHighlightRange(range) {
    this.setState({
      highlightedRange: range,
      highlightedDate: null
    });
    if (typeof(this.props.onHighlightRange) === 'function') { 
      this.props.onHighlightRange(range);
    }    
  },

  onUnHighlightDate() {
    this.setState({
      highlightedDate: null
    });
  },

  getMonthDate() {
    return moment(new Date(this.state.year, this.state.month, 1));
  },

  canMoveBack() {
    if (this.getMonthDate().subtract(1, 'days').isBefore(this.state.enabledRange.start)) {
      return false;
    }
    return true;
  },

  moveBack() {
    var monthDate;

    if (this.canMoveBack()) {
      monthDate = this.getMonthDate();
      monthDate.subtract(1, 'months');
      this.setState({
        year: monthDate.year(),
        month: monthDate.month()
      });
    }
  },

  moveBackIfSelecting() {
    if (this.state.selectedStartDate) {
      this.moveBack();
    }
  },

  canMoveForward() {
    if (this.getMonthDate().add(this.props.numberOfCalendars, 'months').isAfter(this.state.enabledRange.end)) {
      return false;
    }
    return true;
  },

  moveForward() {
    var monthDate;

    if (this.canMoveForward()) {
      monthDate = this.getMonthDate();
      monthDate.add(1, 'months');
      this.setState({
        year: monthDate.year(),
        month: monthDate.month()
      });
    }
  },

  moveForwardIfSelecting() {
    if (this.state.selectedStartDate) {
      this.moveForward();
    }
  },

  changeYear(year) {
    var {enabledRange, month} = this.state;

    if (moment({years: year, months: month, date: 1}).unix() < enabledRange.start.unix()) {
      month = enabledRange.start.month();
    }

    if (moment({years: year, months: month + 1, date: 1}).unix() > enabledRange.end.unix()) {
      month = enabledRange.end.month();
    }

    this.setState({
      year: year,
      month: month
    });
  },

  changeMonth(date) {
    this.setState({
      month: date
    });
  },

  renderCalendar(index) {
    var {
      bemBlock,
      bemNamespace,
      firstOfWeek,
      numberOfCalendars,
      selectionType,
      value
    } = this.props;

    var {
      dateStates,
      enabledRange,
      hideSelection, 
      highlightedDate,
      highlightedRange,
      highlightStartDate,
      selectedStartDate
    } = this.state;

    var monthDate = this.getMonthDate();
    var year = monthDate.year();
    var month = monthDate.month();
    var key = `${ index}-${ year }-${ month }`;
    var props;

    monthDate.add(index, 'months');

    props = {
      bemBlock,
      bemNamespace,
      dateStates,
      enabledRange,
      firstOfWeek,
      hideSelection,
      highlightedDate,
      highlightedRange,
      highlightStartDate,
      index,
      key,
      selectedStartDate,
      selectionType,
      value,
      maxIndex: numberOfCalendars - 1,
      firstOfMonth: monthDate,
      onMonthChange: this.changeMonth,
      onYearChange: this.changeYear,
      onHighlightRange: this.onHighlightRange,
      onHighlightDate: this.onHighlightDate,
      onUnHighlightDate: this.onUnHighlightDate,
      onSelect: this.onSelect,
      startRangeSelection: this.startRangeSelection,
      completeSelection: this.completeSelection,
      completeRangeSelection: this.completeRangeSelection,
      dateComponent: CalendarDate
    };

    return <CalendarMonth {...props} />;
  },

  render: function() {
    var {paginationArrowComponent: PaginationArrow, numberOfCalendars, stateDefinitions, selectedLabel, showLegend} = this.props;

    var calendars = Immutable.Range(0, numberOfCalendars).map(this.renderCalendar);

    return (
      <div className={this.cx({element: null})}>
        <PaginationArrow direction="previous" onMouseEnter={this.moveBackIfSelecting} onClick={this.moveBack} disabled={!this.canMoveBack()} />
        {calendars.toJS()}
        <PaginationArrow direction="next" onMouseEnter={this.moveForwardIfSelecting} onClick={this.moveForward} disabled={!this.canMoveForward()} />
        {showLegend ? <Legend stateDefinitions={stateDefinitions} selectedLabel={selectedLabel} /> : null}
      </div>
    );
  }
});

export default DateRangePicker;
