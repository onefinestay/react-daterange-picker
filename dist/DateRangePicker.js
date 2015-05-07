'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utilsBemMixin = require('./utils/BemMixin');

var _utilsBemMixin2 = _interopRequireDefault(_utilsBemMixin);

var _Legend = require('./Legend');

var _Legend2 = _interopRequireDefault(_Legend);

var _calendarCalendarMonth = require('./calendar/CalendarMonth');

var _calendarCalendarMonth2 = _interopRequireDefault(_calendarCalendarMonth);

var _calendarCalendarDate = require('./calendar/CalendarDate');

var _calendarCalendarDate2 = _interopRequireDefault(_calendarCalendarDate);

var _PaginationArrow = require('./PaginationArrow');

var _PaginationArrow2 = _interopRequireDefault(_PaginationArrow);

'use strict';

var PureRenderMixin = _reactAddons2['default'].addons.PureRenderMixin;

var absoluteMinimum = _moment2['default'](new Date(-8640000000000000 / 2)).startOf('day');
var absoluteMaximum = _moment2['default'](new Date(8640000000000000 / 2)).startOf('day');

_reactAddons2['default'].initializeTouchEvents(true);

function noop() {}

var DateRangePicker = _reactAddons2['default'].createClass({
  displayName: 'DateRangePicker',

  mixins: [_utilsBemMixin2['default'], PureRenderMixin],

  propTypes: {
    bemNamespace: _reactAddons2['default'].PropTypes.string,
    bemBlock: _reactAddons2['default'].PropTypes.string,
    numberOfCalendars: _reactAddons2['default'].PropTypes.number,
    firstOfWeek: _reactAddons2['default'].PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    disableNavigation: _reactAddons2['default'].PropTypes.bool,
    initialDate: _reactAddons2['default'].PropTypes.instanceOf(Date),
    initialRange: _reactAddons2['default'].PropTypes.object,
    initialMonth: _reactAddons2['default'].PropTypes.number, // Overrides values derived from initialDate/initialRange
    initialYear: _reactAddons2['default'].PropTypes.number, // Overrides values derived from initialDate/initialRange
    minimumDate: _reactAddons2['default'].PropTypes.instanceOf(Date),
    maximumDate: _reactAddons2['default'].PropTypes.instanceOf(Date),
    selectionType: _reactAddons2['default'].PropTypes.oneOf(['single', 'range']),
    stateDefinitions: _reactAddons2['default'].PropTypes.object,
    selectedLabel: _reactAddons2['default'].PropTypes.string,
    dateStates: _reactAddons2['default'].PropTypes.array, // an array of date ranges and their states
    defaultState: _reactAddons2['default'].PropTypes.string,
    initialFromValue: _reactAddons2['default'].PropTypes.bool,
    showLegend: _reactAddons2['default'].PropTypes.bool,
    onSelect: _reactAddons2['default'].PropTypes.func,
    onSelectStart: _reactAddons2['default'].PropTypes.func,
    paginationArrowComponent: _reactAddons2['default'].PropTypes.func,
    value: function value(props, propName, componentName) {
      var val = props[propName];

      if (!val) {
        return;
      } else if (_moment2['default'].isMoment(val)) {
        return;
      } else if (val.start && val.end && _moment2['default'].isMoment(val.start) && _moment2['default'].isMoment(val.end)) {
        return;
      }
      return new Error('Value must be a moment or a moment range');
    }
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
      stateDefinitions: {
        '__default': {
          color: null,
          selectable: true,
          label: null
        }
      },
      selectedLabel: 'Your selected dates',
      defaultState: '__default',
      dateStates: [],
      showLegend: false,
      onSelect: noop,
      paginationArrowComponent: _PaginationArrow2['default']
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      dateStates: this.getDateStates(nextProps),
      enabledRange: this.getEnabledRange(nextProps)
    });
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var initialYear = _props.initialYear;
    var initialMonth = _props.initialMonth;
    var initialFromValue = _props.initialFromValue;
    var selectionType = _props.selectionType;
    var value = _props.value;

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
      enabledRange: this.getEnabledRange(this.props),
      dateStates: this.getDateStates(this.props)
    };
  },

  getEnabledRange: function getEnabledRange(props) {
    var min = props.minimumDate ? _moment2['default'](props.minimumDate).startOf('day') : absoluteMinimum;
    var max = props.maximumDate ? _moment2['default'](props.maximumDate).startOf('day') : absoluteMaximum;

    return _moment2['default']().range(min, max);
  },

  getDateStates: function getDateStates(props) {
    var dateStates = props.dateStates;
    var defaultState = props.defaultState;
    var stateDefinitions = props.stateDefinitions;

    var actualStates = [];
    var minDate = absoluteMinimum;
    var maxDate = absoluteMaximum;
    var dateCursor = _moment2['default'](minDate).startOf('day');

    var defs = _immutable2['default'].fromJS(stateDefinitions);

    dateStates.forEach((function (s) {
      var r = s.range;
      var start = r.start.startOf('day');
      var end = r.end.startOf('day');

      if (!dateCursor.isSame(start)) {
        actualStates.push({
          state: defaultState,
          range: _moment2['default']().range(dateCursor, start)
        });
      }
      actualStates.push(s);
      dateCursor = end;
    }).bind(this));

    actualStates.push({
      state: defaultState,
      range: _moment2['default']().range(dateCursor, maxDate)
    });

    // sanitize date states
    return _immutable2['default'].List(actualStates).map((function (s) {
      var def = defs.get(s.state);
      return _immutable2['default'].Map({
        range: s.range,
        state: s.state,
        selectable: def.get('selectable', true),
        color: def.get('color')
      });
    }).bind(this));
  },

  onSelect: function onSelect(date) {
    this.props.onSelect(_moment2['default'](date));
  },

  startRangeSelection: function startRangeSelection(date) {
    this.setState({
      selectedStartDate: date
    });
    if (typeof this.props.onSelectStart === 'function') {
      this.props.onSelectStart(_moment2['default'](date));
    }
  },

  statesForRange: function statesForRange(range) {
    if (range.start.isSame(range.end)) {
      return this.state.dateStates.filter(function (d) {
        return range.start.within(d.get('range'));
      }).map(function (d) {
        return d.get('state');
      });
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
        highlightedDate: null
      });
      this.props.onSelect(highlightedDate);
    }
  },

  completeRangeSelection: function completeRangeSelection() {
    var range = this.state.highlightedRange;
    if (range && !range.start.isSame(range.end)) {
      this.setState({
        selectedStartDate: null,
        highlightedRange: null,
        highlightedDate: null
      });
      this.props.onSelect(range, this.statesForRange(range));
    }
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
    return _moment2['default'](new Date(this.state.year, this.state.month, 1));
  },

  canMoveBack: function canMoveBack() {
    if (this.getMonthDate().subtract(1, 'days').isBefore(this.state.enabledRange.start)) {
      return false;
    }
    return true;
  },

  moveBack: function moveBack() {
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

  moveBackIfSelecting: function moveBackIfSelecting() {
    if (this.state.selectedStartDate) {
      this.moveBack();
    }
  },

  canMoveForward: function canMoveForward() {
    if (this.getMonthDate().add(this.props.numberOfCalendars, 'months').isAfter(this.state.enabledRange.end)) {
      return false;
    }
    return true;
  },

  moveForward: function moveForward() {
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

  moveForwardIfSelecting: function moveForwardIfSelecting() {
    if (this.state.selectedStartDate) {
      this.moveForward();
    }
  },

  changeYear: function changeYear(year) {
    var _state = this.state;
    var enabledRange = _state.enabledRange;
    var month = _state.month;

    if (_moment2['default']({ years: year, months: month, date: 1 }).unix() < enabledRange.start.unix()) {
      month = enabledRange.start.month();
    }

    if (_moment2['default']({ years: year, months: month + 1, date: 1 }).unix() > enabledRange.end.unix()) {
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
    var highlightedDate = _state2.highlightedDate;
    var highlightedRange = _state2.highlightedRange;
    var highlightStartDate = _state2.highlightStartDate;
    var selectedStartDate = _state2.selectedStartDate;

    var monthDate = this.getMonthDate();
    var year = monthDate.year();
    var month = monthDate.month();
    var key = '' + index + '-' + year + '-' + month;
    var props;

    monthDate.add(index, 'months');

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
      startRangeSelection: this.startRangeSelection,
      completeSelection: this.completeSelection,
      completeRangeSelection: this.completeRangeSelection,
      dateComponent: _calendarCalendarDate2['default']
    };

    return _reactAddons2['default'].createElement(_calendarCalendarMonth2['default'], props);
  },

  render: function render() {
    var _props3 = this.props;
    var PaginationArrow = _props3.paginationArrowComponent;
    var numberOfCalendars = _props3.numberOfCalendars;
    var stateDefinitions = _props3.stateDefinitions;
    var selectedLabel = _props3.selectedLabel;
    var showLegend = _props3.showLegend;

    var calendars = _immutable2['default'].Range(0, numberOfCalendars).map(this.renderCalendar);

    return _reactAddons2['default'].createElement(
      'div',
      { className: this.cx({ element: null }) },
      _reactAddons2['default'].createElement(PaginationArrow, { direction: 'previous', onMouseEnter: this.moveBackIfSelecting, onClick: this.moveBack, disabled: !this.canMoveBack() }),
      calendars.toJS(),
      _reactAddons2['default'].createElement(PaginationArrow, { direction: 'next', onMouseEnter: this.moveForwardIfSelecting, onClick: this.moveForward, disabled: !this.canMoveForward() }),
      showLegend ? _reactAddons2['default'].createElement(_Legend2['default'], { stateDefinitions: stateDefinitions, selectedLabel: selectedLabel }) : null
    );
  }
});

exports['default'] = DateRangePicker;
module.exports = exports['default'];