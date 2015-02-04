"use strict";
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var moment = _interopRequire(require("moment"));

var Immutable = _interopRequire(require("immutable"));

var BemMixin = _interopRequire(require("./utils/BemMixin"));

var Legend = _interopRequire(require("./Legend"));

var CalendarMonth = _interopRequire(require("./calendar/CalendarMonth"));

var CalendarDate = _interopRequire(require("./calendar/CalendarDate"));

var PaginationArrow = _interopRequire(require("./PaginationArrow"));

var PureRenderMixin = React.addons.PureRenderMixin;


function noop() {}


var DateRangePicker = React.createClass({
  displayName: "DateRangePicker",
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
    selectionType: React.PropTypes.oneOf(["single", "range"]),
    stateDefinitions: React.PropTypes.object,
    dateStates: React.PropTypes.array, // an array of date ranges and their states
    defaultState: React.PropTypes.string,
    value: React.PropTypes.object, // range or single value
    initialFromValue: React.PropTypes.bool,
    showLegend: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    paginationArrowComponent: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    var date = new Date();
    var initialDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return {
      bemNamespace: null,
      bemBlock: "DateRangePicker",
      numberOfCalendars: 1,
      firstOfWeek: 0,
      disableNavigation: false,
      nextLabel: "",
      previousLabel: "",
      initialDate: initialDate,
      initialFromValue: true,
      selectionType: "range",
      stateDefinitions: {
        __default: {
          color: null,
          selectable: true,
          label: null
        }
      },
      defaultState: "__default",
      dateStates: [],
      showLegend: false,
      onSelect: noop,
      paginationArrowComponent: PaginationArrow
    };
  },

  getInitialState: function getInitialState() {
    var initialYear = this.props.initialYear;
    var initialMonth = this.props.initialMonth;
    var initialFromValue = this.props.initialFromValue;
    var selectionType = this.props.selectionType;
    var value = this.props.value;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();

    if (initialYear && initialMonth) {
      year = initialYear;
      month = initialMonth;
    }

    if (initialFromValue && value) {
      if (selectionType === "single") {
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

  getDateStates: function getDateStates() {
    var dateStates = this.props.dateStates;
    var defaultState = this.props.defaultState;
    var actualStates = [];
    var minDate = new Date(-8640000000000000 / 2);
    var maxDate = new Date(8640000000000000 / 2);
    var dateCursor = moment(minDate).startOf("day");

    dateStates.forEach((function (s) {
      var r = s.range;
      var start = r.start.startOf("day");
      var end = r.end.startOf("day");

      if (!dateCursor.isSame(start)) {
        actualStates.push({
          state: defaultState,
          range: moment().range(dateCursor, start)
        });
      }
      actualStates.push(s);
      dateCursor = end;
    }).bind(this));

    actualStates.push({
      state: defaultState,
      range: moment().range(dateCursor, moment(maxDate).startOf("day"))
    });
    return actualStates;
  },

  onSelect: function onSelect(date) {
    this.props.onSelect(moment(date));
  },

  onStartSelection: function onStartSelection(date) {
    this.setState({
      selectedStartDate: date
    });
  },

  onCompleteSelection: function onCompleteSelection(range, states) {
    this.setState({
      selectedStartDate: null,
      highlightedRange: null,
      highlightedDate: null
    });
    this.props.onSelect(range, states);
  },

  onHighlightDate: function onHighlightDate(date) {
    this.setState({
      highlightedDate: date });
  },

  onHighlightRange: function onHighlightRange(range) {
    this.setState({
      highlightedRange: range,
      highlightedDate: null
    });
  },

  onUnHighlightDate: function onUnHighlightDate(date) {
    this.setState({
      highlightedDate: null
    });
  },

  getMonthDate: function getMonthDate() {
    return new Date(this.state.year, this.state.month, 1);
  },

  moveForward: function moveForward() {
    var monthDate = this.getMonthDate();
    monthDate.setMonth(monthDate.getMonth() + 1);
    this.setState({
      year: monthDate.getFullYear(),
      month: monthDate.getMonth()
    });
  },

  moveBack: function moveBack() {
    var monthDate = this.getMonthDate();
    monthDate.setMonth(monthDate.getMonth() - 1);
    this.setState({
      year: monthDate.getFullYear(),
      month: monthDate.getMonth()
    });
  },

  changeYear: function changeYear(year) {
    var earliestDate = this.props.earliestDate;
    var latestDate = this.props.latestDate;
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

  changeMonth: function changeMonth(date) {
    this.setState({
      month: date
    });
  },

  renderCalendar: function renderCalendar(index) {
    var bemBlock = this.props.bemBlock;
    var bemNamespace = this.props.bemNamespace;
    var earliestDate = this.props.earliestDate;
    var firstOfWeek = this.props.firstOfWeek;
    var latestDate = this.props.latestDate;
    var numberOfCalendars = this.props.numberOfCalendars;
    var selectionType = this.props.selectionType;
    var stateDefinitions = this.props.stateDefinitions;
    var value = this.props.value;
    var highlightedDate = this.state.highlightedDate;
    var highlightedRange = this.state.highlightedRange;
    var highlightStartDate = this.state.highlightStartDate;
    var selectedStartDate = this.state.selectedStartDate;


    var monthDate = this.getMonthDate();
    var year = monthDate.getFullYear();
    var month = monthDate.getMonth();
    var key = index + "-" + year + "-" + month;
    var props;
    var dateStates;

    monthDate = new Date(year, month + index, 1);

    // sanitize date states
    dateStates = Immutable.List(this.getDateStates()).map((function (s) {
      var def = stateDefinitions[s.state];
      return Immutable.Map({
        range: s.range,
        state: s.state,
        selectable: def.selectable,
        color: def.color
      });
    }).bind(this));

    props = {
      bemBlock: bemBlock,
      bemNamespace: bemNamespace,
      dateStates: dateStates,
      firstOfWeek: firstOfWeek,
      highlightedDate: highlightedDate,
      highlightedRange: highlightedRange,
      highlightStartDate: highlightStartDate,
      index: index,
      key: key,
      selectedStartDate: selectedStartDate,
      selectionType: selectionType,
      value: value,
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

    return React.createElement(CalendarMonth, props);
  },

  render: function () {
    var PaginationArrow = this.props.paginationArrowComponent;
    var numberOfCalendars = this.props.numberOfCalendars;
    var stateDefinitions = this.props.stateDefinitions;
    var showLegend = this.props.showLegend;


    var calendars = Immutable.Range(0, numberOfCalendars).map(this.renderCalendar);

    return React.createElement(
      "div",
      { className: this.cx() },
      React.createElement(PaginationArrow, { direction: "previous", onClick: this.moveBack }),
      calendars.toJS(),
      React.createElement(PaginationArrow, { direction: "next", onClick: this.moveForward }),
      showLegend ? React.createElement(Legend, { stateDefinitions: stateDefinitions }) : null
    );
  }
});

module.exports = DateRangePicker;