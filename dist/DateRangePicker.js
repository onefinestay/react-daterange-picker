'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-range');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _calendar = require('calendar');

var _calendar2 = _interopRequireDefault(_calendar);

var _utilsBemMixin = require('./utils/BemMixin');

var _utilsBemMixin2 = _interopRequireDefault(_utilsBemMixin);

var _utilsCustomPropTypes = require('./utils/CustomPropTypes');

var _utilsCustomPropTypes2 = _interopRequireDefault(_utilsCustomPropTypes);

var _Legend = require('./Legend');

var _Legend2 = _interopRequireDefault(_Legend);

var _calendarCalendarMonth = require('./calendar/CalendarMonth');

var _calendarCalendarMonth2 = _interopRequireDefault(_calendarCalendarMonth);

var _calendarCalendarDate = require('./calendar/CalendarDate');

var _calendarCalendarDate2 = _interopRequireDefault(_calendarCalendarDate);

var _PaginationArrow = require('./PaginationArrow');

var _PaginationArrow2 = _interopRequireDefault(_PaginationArrow);

var _utilsIsMomentRange = require('./utils/isMomentRange');

var _utilsIsMomentRange2 = _interopRequireDefault(_utilsIsMomentRange);

var PureRenderMixin = _reactAddons2['default'].addons.PureRenderMixin;
var absoluteMinimum = (0, _moment2['default'])(new Date(-8640000000000000 / 2)).startOf('day');
var absoluteMaximum = (0, _moment2['default'])(new Date(8640000000000000 / 2)).startOf('day');

try {
  _reactAddons2['default'].initializeTouchEvents(true);
} catch (err) {}

function noop() {}

var DateRangePicker = _reactAddons2['default'].createClass({
  displayName: 'DateRangePicker',

  mixins: [_utilsBemMixin2['default'], PureRenderMixin],

  propTypes: {
    bemBlock: _reactAddons2['default'].PropTypes.string,
    bemNamespace: _reactAddons2['default'].PropTypes.string,
    dateStates: _reactAddons2['default'].PropTypes.array, // an array of date ranges and their states
    defaultState: _reactAddons2['default'].PropTypes.string,
    disableNavigation: _reactAddons2['default'].PropTypes.bool,
    firstOfWeek: _reactAddons2['default'].PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    helpMessage: _reactAddons2['default'].PropTypes.string,
    initialDate: _reactAddons2['default'].PropTypes.instanceOf(Date),
    initialFromValue: _reactAddons2['default'].PropTypes.bool,
    initialMonth: _reactAddons2['default'].PropTypes.number, // Overrides values derived from initialDate/initialRange
    initialRange: _reactAddons2['default'].PropTypes.object,
    initialYear: _reactAddons2['default'].PropTypes.number, // Overrides values derived from initialDate/initialRange
    maximumDate: _reactAddons2['default'].PropTypes.instanceOf(Date),
    minimumDate: _reactAddons2['default'].PropTypes.instanceOf(Date),
    numberOfCalendars: _reactAddons2['default'].PropTypes.number,
    onHighlightDate: _reactAddons2['default'].PropTypes.func, // triggered when a date is highlighted (hovered)
    onHighlightRange: _reactAddons2['default'].PropTypes.func, // triggered when a range is highlighted (hovered)
    onSelect: _reactAddons2['default'].PropTypes.func, // triggered when a date or range is selectec
    onSelectStart: _reactAddons2['default'].PropTypes.func, // triggered when the first date in a range is selected
    paginationArrowComponent: _reactAddons2['default'].PropTypes.func,
    selectedLabel: _reactAddons2['default'].PropTypes.string,
    selectionType: _reactAddons2['default'].PropTypes.oneOf(['single', 'range', 'multiple']),
    singleDateRange: _reactAddons2['default'].PropTypes.bool,
    showLegend: _reactAddons2['default'].PropTypes.bool,
    stateDefinitions: _reactAddons2['default'].PropTypes.object,
    value: _reactAddons2['default'].PropTypes.oneOfType([_reactAddons2['default'].PropTypes.array, _utilsCustomPropTypes2['default'].momentOrMomentRange])

  },

  getDefaultProps: function getDefaultProps() {
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
      singleDateRange: false,
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
      paginationArrowComponent: _PaginationArrow2['default']
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var nextDateStates = this.getDateStates(nextProps);
    var nextEnabledRange = this.getEnabledRange(nextProps);

    this.setState({
      dateStates: this.state.dateStates && _immutable2['default'].is(this.state.dateStates, nextDateStates) ? this.state.dateStates : nextDateStates,
      enabledRange: this.state.enabledRange && this.state.enabledRange.isSame(nextEnabledRange) ? this.state.enabledRange : nextEnabledRange
    });
  },

  getInitialState: function getInitialState() {
    var now = new Date();
    var _props = this.props;
    var initialYear = _props.initialYear;
    var initialMonth = _props.initialMonth;
    var initialFromValue = _props.initialFromValue;
    var selectionType = _props.selectionType;
    var value = _props.value;

    var year = now.getFullYear();
    var month = now.getMonth();
    var selectedMultipleDates = [];

    if (initialYear && initialMonth) {
      year = initialYear;
      month = initialMonth;
    }

    if (value instanceof Array) {
      selectedMultipleDates = value.map(function (selectedDate) {
        return (0, _moment2['default'])(selectedDate).format('YYYY-MM-DD');
      });
    }
    if (initialFromValue && value) {
      if (selectionType === 'single') {
        year = value.year();
        month = value.month();
      } else if (selectionType === 'range') {
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
      highlightedDates: selectedMultipleDates,
      highlightRange: null,
      hideSelection: false,
      enabledRange: this.getEnabledRange(this.props),
      dateStates: this.getDateStates(this.props)
    };
  },

  getEnabledRange: function getEnabledRange(props) {
    var min = props.minimumDate ? (0, _moment2['default'])(props.minimumDate).startOf('day') : absoluteMinimum;
    var max = props.maximumDate ? (0, _moment2['default'])(props.maximumDate).startOf('day') : absoluteMaximum;

    return _moment2['default'].range(min, max);
  },

  getDateStates: function getDateStates(props) {
    var dateStates = props.dateStates;
    var defaultState = props.defaultState;
    var stateDefinitions = props.stateDefinitions;

    var actualStates = [];
    var minDate = absoluteMinimum;
    var maxDate = absoluteMaximum;
    var dateCursor = (0, _moment2['default'])(minDate).startOf('day');

    var defs = _immutable2['default'].fromJS(stateDefinitions);

    dateStates.forEach(function (s) {
      var r = s.range;
      var start = r.start.startOf('day');
      var end = r.end.startOf('day');

      if (!dateCursor.isSame(start, 'day')) {
        actualStates.push({
          state: defaultState,
          range: _moment2['default'].range(dateCursor, start)
        });
      }
      actualStates.push(s);
      dateCursor = end;
    });

    actualStates.push({
      state: defaultState,
      range: _moment2['default'].range(dateCursor, maxDate)
    });

    // sanitize date states
    return _immutable2['default'].List(actualStates).map(function (s) {
      var def = defs.get(s.state);
      return _immutable2['default'].Map({
        range: s.range,
        state: s.state,
        selectable: def.get('selectable', true),
        color: def.get('color')
      });
    });
  },

  isDateDisabled: function isDateDisabled(date) {
    return !this.state.enabledRange.contains(date);
  },

  isDateSelectable: function isDateSelectable(date) {
    return this.dateRangesForDate(date).some(function (r) {
      return r.get('selectable');
    });
  },

  nonSelectableStateRanges: function nonSelectableStateRanges() {
    return this.state.dateStates.filter(function (d) {
      return !d.get('selectable');
    });
  },

  dateRangesForDate: function dateRangesForDate(date) {
    return this.state.dateStates.filter(function (d) {
      return d.get('range').contains(date);
    });
  },

  sanitizeRange: function sanitizeRange(range, forwards) {
    /* Truncates the provided range at the first intersection
     * with a non-selectable state. Using forwards to determine
     * which direction to work
     */
    var blockedRanges = this.nonSelectableStateRanges().map(function (r) {
      return r.get('range');
    });
    var intersect = undefined;

    if (forwards) {
      intersect = blockedRanges.find(function (r) {
        return range.intersect(r);
      });
      if (intersect) {
        return _moment2['default'].range(range.start, intersect.start);
      }
    } else {
      intersect = blockedRanges.findLast(function (r) {
        return range.intersect(r);
      });

      if (intersect) {
        return _moment2['default'].range(intersect.end, range.end);
      }
    }

    if (range.start.isBefore(this.state.enabledRange.start)) {
      return _moment2['default'].range(this.state.enabledRange.start, range.end);
    }

    if (range.end.isAfter(this.state.enabledRange.end)) {
      return _moment2['default'].range(range.start, this.state.enabledRange.end);
    }

    return range;
  },

  highlightRange: function highlightRange(range) {
    this.setState({
      highlightedRange: range,
      highlightedDate: null
    });
    if (typeof this.props.onHighlightRange === 'function') {
      this.props.onHighlightRange(range, this.statesForRange(range));
    }
  },

  onUnHighlightDate: function onUnHighlightDate() {
    this.setState({
      highlightedDate: null
    });
  },

  onSelectDate: function onSelectDate(date) {
    var selectionType = this.props.selectionType;
    var selectedStartDate = this.state.selectedStartDate;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        this.completeRangeSelection();
      } else if (!this.isDateDisabled(date) && this.isDateSelectable(date)) {
        this.startRangeSelection(date);
        if (this.props.singleDateRange) {
          this.highlightRange(_moment2['default'].range(date, date));
        }
      }
    } else if (selectionType === 'multiple') {
      if (!this.isDateDisabled(date) && this.isDateSelectable(date)) {
        this.completeMultipleSelection(date);
      }
    } else {
      if (!this.isDateDisabled(date) && this.isDateSelectable(date)) {
        this.completeSelection();
      }
    }
  },

  onHighlightDate: function onHighlightDate(date) {
    var selectionType = this.props.selectionType;
    var selectedStartDate = this.state.selectedStartDate;

    var datePair = undefined;
    var range = undefined;
    var forwards = undefined;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        datePair = _immutable2['default'].List.of(selectedStartDate, date).sortBy(function (d) {
          return d.unix();
        });
        range = _moment2['default'].range(datePair.get(0), datePair.get(1));
        forwards = range.start.unix() === selectedStartDate.unix();
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

  startRangeSelection: function startRangeSelection(date) {
    this.setState({
      hideSelection: true,
      selectedStartDate: date
    });
    if (typeof this.props.onSelectStart === 'function') {
      this.props.onSelectStart((0, _moment2['default'])(date));
    }
  },

  statesForDate: function statesForDate(date) {
    return this.state.dateStates.filter(function (d) {
      return date.within(d.get('range'));
    }).map(function (d) {
      return d.get('state');
    });
  },

  statesForRange: function statesForRange(range) {
    if (range.start.isSame(range.end, 'day')) {
      return this.statesForDate(range.start);
    }
    return this.state.dateStates.filter(function (d) {
      return d.get('range').intersect(range);
    }).map(function (d) {
      return d.get('state');
    });
  },

  completeSelection: function completeSelection() {
    var highlightedDate = this.state.highlightedDate;
    if (highlightedDate) {
      this.setState({
        hideSelection: false,
        highlightedDate: null
      });
      this.props.onSelect(highlightedDate, this.statesForDate(highlightedDate));
    }
  },

  completeRangeSelection: function completeRangeSelection() {
    var range = this.state.highlightedRange;

    if (range && (!range.start.isSame(range.end, 'day') || this.props.singleDateRange)) {
      this.setState({
        selectedStartDate: null,
        highlightedRange: null,
        highlightedDate: null,
        hideSelection: false
      });
      this.props.onSelect(range, this.statesForRange(range));
    }
  },

  completeMultipleSelection: function completeMultipleSelection(momentDate) {
    var date = momentDate.format('YYYY-MM-DD');

    var highlightedDates = this.state.highlightedDates;
    var index = highlightedDates.indexOf(date);

    if (index > -1) {
      highlightedDates.splice(index, 1);
      this.setState({ highlightedDates: highlightedDates });
    } else {
      highlightedDates.push(date);
      this.setState({ highlightedDates: highlightedDates });
    }
    this.props.onSelect(highlightedDates, this.statesForDate(momentDate));
  },

  highlightDate: function highlightDate(date) {
    this.setState({
      highlightedDate: date
    });
    if (typeof this.props.onHighlightDate === 'function') {
      this.props.onHighlightDate(date, this.statesForDate(date));
    }
  },

  getMonthDate: function getMonthDate() {
    return (0, _moment2['default'])(new Date(this.state.year, this.state.month, 1));
  },

  canMoveBack: function canMoveBack() {
    if (this.getMonthDate().subtract(1, 'days').isBefore(this.state.enabledRange.start)) {
      return false;
    }
    return true;
  },

  moveBack: function moveBack() {
    var monthDate = undefined;

    if (this.canMoveBack()) {
      monthDate = this.getMonthDate();
      monthDate.subtract(1, 'months');
      this.setState({
        year: monthDate.year(),
        month: monthDate.month()
      });
    }
  },

  canMoveForward: function canMoveForward() {
    if (this.getMonthDate().add(this.props.numberOfCalendars, 'months').isAfter(this.state.enabledRange.end)) {
      return false;
    }
    return true;
  },

  moveForward: function moveForward() {
    var monthDate = undefined;

    if (this.canMoveForward()) {
      monthDate = this.getMonthDate();
      monthDate.add(1, 'months');
      this.setState({
        year: monthDate.year(),
        month: monthDate.month()
      });
    }
  },

  changeYear: function changeYear(year) {
    var _state = this.state;
    var enabledRange = _state.enabledRange;
    var month = _state.month;

    if ((0, _moment2['default'])({ years: year, months: month, date: 1 }).unix() < enabledRange.start.unix()) {
      month = enabledRange.start.month();
    }

    if ((0, _moment2['default'])({ years: year, months: month + 1, date: 1 }).unix() > enabledRange.end.unix()) {
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
    var _props2 = this.props;
    var bemBlock = _props2.bemBlock;
    var bemNamespace = _props2.bemNamespace;
    var firstOfWeek = _props2.firstOfWeek;
    var numberOfCalendars = _props2.numberOfCalendars;
    var selectionType = _props2.selectionType;
    var value = _props2.value;
    var _state2 = this.state;
    var dateStates = _state2.dateStates;
    var enabledRange = _state2.enabledRange;
    var hideSelection = _state2.hideSelection;
    var highlightedDate = _state2.highlightedDate;
    var highlightedDates = _state2.highlightedDates;
    var highlightedRange = _state2.highlightedRange;

    var monthDate = this.getMonthDate();
    var year = monthDate.year();
    var month = monthDate.month();
    var key = index + '-' + year + '-' + month;
    var props = undefined;

    monthDate.add(index, 'months');

    var cal = new _calendar2['default'].Calendar(firstOfWeek);
    var monthDates = _immutable2['default'].fromJS(cal.monthDates(monthDate.year(), monthDate.month()));
    var monthStart = monthDates.first().first();
    var monthEnd = monthDates.last().last();
    var monthRange = _moment2['default'].range(monthStart, monthEnd);

    if (_moment2['default'].isMoment(value)) {
      if (!monthRange.contains(value)) {
        value = null;
      }
    } else if ((0, _utilsIsMomentRange2['default'])(value)) {
      if (!monthRange.overlaps(value)) {
        value = null;
      }
    }

    if (!_moment2['default'].isMoment(highlightedDate) || !monthRange.contains(highlightedDate)) {
      highlightedDate = null;
    }

    if (!(0, _utilsIsMomentRange2['default'])(highlightedRange) || !monthRange.overlaps(highlightedRange)) {
      highlightedRange = null;
    }

    props = {
      bemBlock: bemBlock,
      bemNamespace: bemNamespace,
      dateStates: dateStates,
      enabledRange: enabledRange,
      firstOfWeek: firstOfWeek,
      hideSelection: hideSelection,
      highlightedDate: highlightedDate,
      highlightedDates: highlightedDates,
      highlightedRange: highlightedRange,
      index: index,
      key: key,
      selectionType: selectionType,
      value: value,
      maxIndex: numberOfCalendars - 1,
      firstOfMonth: monthDate,
      onMonthChange: this.changeMonth,
      onYearChange: this.changeYear,
      onSelectDate: this.onSelectDate,
      onHighlightDate: this.onHighlightDate,
      onUnHighlightDate: this.onUnHighlightDate,
      dateRangesForDate: this.dateRangesForDate,
      dateComponent: _calendarCalendarDate2['default']
    };

    return _reactAddons2['default'].createElement(_calendarCalendarMonth2['default'], props);
  },

  render: function render() {
    var _props3 = this.props;
    var PaginationArrowComponent = _props3.paginationArrowComponent;
    var numberOfCalendars = _props3.numberOfCalendars;
    var stateDefinitions = _props3.stateDefinitions;
    var selectedLabel = _props3.selectedLabel;
    var showLegend = _props3.showLegend;
    var helpMessage = _props3.helpMessage;

    var calendars = _immutable2['default'].Range(0, numberOfCalendars).map(this.renderCalendar);

    return _reactAddons2['default'].createElement(
      'div',
      { className: this.cx({ element: null }) },
      _reactAddons2['default'].createElement(PaginationArrowComponent, { direction: 'previous', onTrigger: this.moveBack, disabled: !this.canMoveBack() }),
      calendars.toJS(),
      _reactAddons2['default'].createElement(PaginationArrowComponent, { direction: 'next', onTrigger: this.moveForward, disabled: !this.canMoveForward() }),
      helpMessage ? _reactAddons2['default'].createElement(
        'span',
        { className: this.cx({ element: 'HelpMessage' }) },
        helpMessage
      ) : null,
      showLegend ? _reactAddons2['default'].createElement(_Legend2['default'], { stateDefinitions: stateDefinitions, selectedLabel: selectedLabel }) : null
    );
  }
});

exports['default'] = DateRangePicker;
module.exports = exports['default'];