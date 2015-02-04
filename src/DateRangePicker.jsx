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


function noop () {}


var DateRangePicker = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  propTypes: {
    bemNamespace: React.PropTypes.string,
    bemBlock: React.PropTypes.string,
    numberOfCalendars: React.PropTypes.number,
    firstOfWeek: React.PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    disableNavigation: React.PropTypes.bool,
    initialDate: React.PropTypes.instanceOf(Date),
    initialRange: React.PropTypes.object,
    initialMonth: React.PropTypes.number, // Overrides values derived from initialDate/initialRange
    initialYear: React.PropTypes.number, // Overrides values derived from initialDate/initialRange
    earliestDate: React.PropTypes.instanceOf(Date),
    latestDate: React.PropTypes.instanceOf(Date),
    selectionType: React.PropTypes.oneOf(['single', 'range']),
    stateDefinitions: React.PropTypes.object,
    dateStates: React.PropTypes.array, // an array of date ranges and their states
    defaultState: React.PropTypes.string,
    value: React.PropTypes.object, // range or single value
    initialFromValue: React.PropTypes.bool,
    showLegend: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    paginationArrowComponent: React.PropTypes.func
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
      defaultState: '__default',
      dateStates: [],
      showLegend: false,
      onSelect: noop,
      paginationArrowComponent: PaginationArrow
    };
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
        year = value.toDate().getFullYear();
        month = value.toDate().getMonth();
      } else {
        year = value.start.toDate().getFullYear();
        month = value.start.toDate().getMonth();
      }
    }

    return {
      year: year,
      month: month,
      selectedStartDate: null,
      highlightStartDate: null,
      highlightedDate: null,
      highlightRange: null
    };
  },

  getDateStates() {
    var {dateStates, defaultState} = this.props;
    var actualStates = [];
    var minDate = new Date(-8640000000000000 / 2);
    var maxDate = new Date(8640000000000000 / 2);
    var dateCursor = moment(minDate);

    dateStates.forEach(function(s) {
      var r = s.range;
      if (!dateCursor.isSame(r.start)) {
        actualStates.push({
          state: defaultState,
          range: moment().range(
            dateCursor,
            r.start
          )
        });
      }
      actualStates.push(s);
      dateCursor = r.end;
    }.bind(this));

    actualStates.push({
      state: defaultState,
      range: moment().range(
        dateCursor,
        moment(maxDate)
      )
    });
    return actualStates;
  },

  onSelect(date) {
    this.props.onSelect(moment(date));
  },

  onStartSelection(date) {
    this.setState({
      selectedStartDate: date
    });
  },

  onCompleteSelection(range, states) {
    this.setState({
      selectedStartDate: null,
      highlightedRange: null,
      highlightedDate: null
    });
    this.props.onSelect(range, states);
  },

  onHighlightDate(date) {
    this.setState({
      highlightedDate: date,
    });
  },

  onHighlightRange(range) {
    this.setState({
      highlightedRange: range,
      highlightedDate: null
    });
  },

  onUnHighlightDate(date) {
    this.setState({
      highlightedDate: null
    });
  },

  getMonthDate() {
    return new Date(this.state.year, this.state.month, 1);
  },

  moveForward() {
    var monthDate = this.getMonthDate();
    monthDate.setMonth(monthDate.getMonth() + 1);
    this.setState({
      year: monthDate.getFullYear(),
      month: monthDate.getMonth()
    });
  },

  moveBack() {
    var monthDate = this.getMonthDate();
    monthDate.setMonth(monthDate.getMonth() - 1);
    this.setState({
      year: monthDate.getFullYear(),
      month: monthDate.getMonth()
    });
  },

  changeYear(year) {
    var {earliestDate, latestDate} = this.props;
    var month = this.state.month;

    if (earliestDate && new Date(year, month, 1).getTime() < earliestDate.getTime()) {
      month = earliestDate.getMonth();
    }

    if (latestDate && new Date(year, month + 1, 1).getTime() > latestDate.getTime()) {
      month = latestDate.getMonth();
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
      earliestDate,
      firstOfWeek,
      latestDate,
      numberOfCalendars,
      selectionType,
      stateDefinitions,
      value
    } = this.props;

    var {
      highlightedDate,
      highlightedRange,
      highlightStartDate,
      selectedStartDate
    } = this.state;

    var monthDate = this.getMonthDate();
    var year = monthDate.getFullYear();
    var month = monthDate.getMonth();
    var key = index + '-' + year + '-' + month;
    var props;
    var dateStates;

    monthDate = new Date(year, month + index, 1);

    // sanitize date states
    dateStates = Immutable.List(this.getDateStates()).map(function(s) {
      var range = moment().range(
        s.range.start.startOf('day'),
        s.range.end.startOf('day')
      );

      var def = stateDefinitions[s.state];

      return Immutable.Map({
        range: range,
        state: s.state,
        selectable: def.selectable,
        color: def.color
      });
    }.bind(this));

    props = {
      bemBlock,
      bemNamespace,
      dateStates,
      firstOfWeek,
      highlightedDate,
      highlightedRange,
      highlightStartDate,
      index,
      key,
      selectedStartDate,
      selectionType,
      value,
      maxIndex: numberOfCalendars - 1,
      minDate: earliestDate,
      maxDate: latestDate,
      firstOfMonth: monthDate,
      onMonthChange: this.changeMonth,
      onYearChange: this.changeYear,
      onHighlightRange: this.onHighlightRange,
      onHighlightDate: this.onHighlightDate,
      onUnHighlightDate: this.onUnHighlightDate,
      onSelect: this.onSelect,
      onStartSelection: this.onStartSelection,
      onCompleteSelection: this.onCompleteSelection,
      dateComponent: CalendarDate
    };

    return <CalendarMonth {...props} />;
  },

  render: function() {
    var {paginationArrowComponent: PaginationArrow, numberOfCalendars, stateDefinitions, showLegend} = this.props;

    var calendars = Immutable.Range(0, numberOfCalendars).map(this.renderCalendar);

    return (
      <div className={this.cx()}>
        <PaginationArrow direction="previous" onClick={this.moveBack} />
        {calendars.toJS()}
        <PaginationArrow direction="next" onClick={this.moveForward} />
        {showLegend ? <Legend stateDefinitions={stateDefinitions} /> : null}
      </div>
    );
  }
});

export default DateRangePicker;
