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

var absoluteMinimum = moment(new Date(-8640000000000000 / 2)).startOf("day");
var absoluteMaximum = moment(new Date(8640000000000000 / 2)).startOf("day");


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
    minimumDate: React.PropTypes.instanceOf(Date),
    maximumDate: React.PropTypes.instanceOf(Date),
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

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      dateStates: this.getDateStates(nextProps),
      enabledRange: this.getEnabledRange(nextProps)
    });
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
      enabledRange: this.getEnabledRange(this.props),
      dateStates: this.getDateStates(this.props)
    };
  },

  getEnabledRange: function getEnabledRange(props) {
    var min = props.minimumDate ? moment(props.minimumDate).startOf("day") : absoluteMinimum;
    var max = props.maximumDate ? moment(props.maximumDate).startOf("day") : absoluteMaximum;

    return moment().range(min, max);
  },

  getDateStates: function getDateStates(props) {
    var dateStates = props.dateStates;
    var defaultState = props.defaultState;
    var stateDefinitions = props.stateDefinitions;
    var actualStates = [];
    var minDate = absoluteMinimum;
    var maxDate = absoluteMaximum;
    var dateCursor = moment(minDate).startOf("day");

    var defs = Immutable.fromJS(stateDefinitions);

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
      range: moment().range(dateCursor, maxDate)
    });

    // sanitize date states
    return Immutable.List(actualStates).map((function (s) {
      var def = defs.get(s.state);
      return Immutable.Map({
        range: s.range,
        state: s.state,
        selectable: def.get("selectable", true),
        color: def.get("color")
      });
    }).bind(this));
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

  onUnHighlightDate: function onUnHighlightDate() {
    this.setState({
      highlightedDate: null
    });
  },

  getMonthDate: function getMonthDate() {
    return moment(new Date(this.state.year, this.state.month, 1));
  },

  canMoveBack: function canMoveBack() {
    if (this.getMonthDate().subtract(1, "days").isBefore(this.state.enabledRange.start)) {
      return false;
    }
    return true;
  },

  moveBack: function moveBack() {
    var monthDate;

    if (this.canMoveBack()) {
      monthDate = this.getMonthDate();
      monthDate.subtract(1, "months");
      this.setState({
        year: monthDate.year(),
        month: monthDate.month()
      });
    }
  },

  canMoveForward: function canMoveForward() {
    if (this.getMonthDate().add(this.props.numberOfCalendars, "months").isAfter(this.state.enabledRange.end)) {
      return false;
    }
    return true;
  },

  moveForward: function moveForward() {
    var monthDate;

    if (this.canMoveForward()) {
      monthDate = this.getMonthDate();
      monthDate.add(1, "months");
      this.setState({
        year: monthDate.year(),
        month: monthDate.month()
      });
    }
  },

  changeYear: function changeYear(year) {
    var enabledRange = this.state.enabledRange;
    var month = this.state.month;


    if (moment({ years: year, months: month, date: 1 }).unix() < enabledRange.start.unix()) {
      month = enabledRange.start.month();
    }

    if (moment({ years: year, months: month + 1, date: 1 }).unix() > enabledRange.end.unix()) {
      month = enabledRange.end.month();
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
    var firstOfWeek = this.props.firstOfWeek;
    var numberOfCalendars = this.props.numberOfCalendars;
    var selectionType = this.props.selectionType;
    var value = this.props.value;
    var dateStates = this.state.dateStates;
    var enabledRange = this.state.enabledRange;
    var highlightedDate = this.state.highlightedDate;
    var highlightedRange = this.state.highlightedRange;
    var highlightStartDate = this.state.highlightStartDate;
    var selectedStartDate = this.state.selectedStartDate;


    var monthDate = this.getMonthDate();
    var year = monthDate.year();
    var month = monthDate.month();
    var key = "" + index + "-" + year + "-" + month;
    var props;

    monthDate.add(index, "months");

    props = {
      bemBlock: bemBlock,
      bemNamespace: bemNamespace,
      dateStates: dateStates,
      enabledRange: enabledRange,
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
      { className: this.cx({ element: null }) },
      React.createElement(PaginationArrow, { direction: "previous", onClick: this.moveBack, disabled: !this.canMoveBack() }),
      calendars.toJS(),
      React.createElement(PaginationArrow, { direction: "next", onClick: this.moveForward, disabled: !this.canMoveForward() }),
      showLegend ? React.createElement(Legend, { stateDefinitions: stateDefinitions }) : null
    );
  }
});

module.exports = DateRangePicker;