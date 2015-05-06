'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _momentRange = require('moment-range');

var _momentRange2 = _interopRequireDefault(_momentRange);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utilsBemMixin = require('../utils/BemMixin');

var _utilsBemMixin2 = _interopRequireDefault(_utilsBemMixin);

var _utilsLightenDarkenColor = require('../utils/lightenDarkenColor');

var _utilsLightenDarkenColor2 = _interopRequireDefault(_utilsLightenDarkenColor);

var _CalendarDatePeriod = require('./CalendarDatePeriod');

var _CalendarDatePeriod2 = _interopRequireDefault(_CalendarDatePeriod);

var _CalendarHighlight = require('./CalendarHighlight');

var _CalendarHighlight2 = _interopRequireDefault(_CalendarHighlight);

var _CalendarSelection = require('./CalendarSelection');

var _CalendarSelection2 = _interopRequireDefault(_CalendarSelection);

'use strict';

var PureRenderMixin = _reactAddons2['default'].addons.PureRenderMixin;

var CalendarDate = _reactAddons2['default'].createClass({
  displayName: 'CalendarDate',

  mixins: [_utilsBemMixin2['default'], PureRenderMixin],

  propTypes: {
    date: _reactAddons2['default'].PropTypes.object.isRequired,

    firstOfMonth: _reactAddons2['default'].PropTypes.object.isRequired,
    index: _reactAddons2['default'].PropTypes.number.isRequired,
    maxIndex: _reactAddons2['default'].PropTypes.number.isRequired,
    selectionType: _reactAddons2['default'].PropTypes.string.isRequired,

    value: _reactAddons2['default'].PropTypes.object,
    hideSelection: _reactAddons2['default'].PropTypes.bool,
    highlightedRange: _reactAddons2['default'].PropTypes.object,
    highlightedDate: _reactAddons2['default'].PropTypes.object,
    selectedStartDate: _reactAddons2['default'].PropTypes.object,
    dateStates: _reactAddons2['default'].PropTypes.instanceOf(_immutable2['default'].List),

    onHighlightDate: _reactAddons2['default'].PropTypes.func,
    onUnHighlightDate: _reactAddons2['default'].PropTypes.func,
    onStartSelection: _reactAddons2['default'].PropTypes.func,
    onCompleteSelection: _reactAddons2['default'].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      hideSelection: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      mouseDown: false
    };
  },

  isDisabled: function isDisabled(date) {
    return !this.props.enabledRange.contains(date);
  },

  isDateSelectable: function isDateSelectable(date) {
    return this.dateRangesForDate(date).some(function (r) {
      return r.get('selectable');
    });
  },

  nonSelectableStateRanges: function nonSelectableStateRanges() {
    return this.props.dateStates.filter(function (d) {
      return !d.get('selectable');
    });
  },

  dateRangesForDate: function dateRangesForDate(date) {
    return this.props.dateStates.filter(function (d) {
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
        return _momentRange2['default']().range(range.start, intersect.start);
      }
    } else {
      intersect = blockedRanges.findLast(function (r) {
        return range.intersect(r);
      });

      if (intersect) {
        return _momentRange2['default']().range(intersect.end, range.end);
      }
    }

    if (range.start.isBefore(this.props.enabledRange.start)) {
      return _momentRange2['default']().range(this.props.enabledRange.start, range.end);
    }

    if (range.end.isAfter(this.props.enabledRange.end)) {
      return _momentRange2['default']().range(range.start, this.props.enabledRange.end);
    }

    return range;
  },

  mouseUp: function mouseUp() {
    this.selectDate();

    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false
      });
    }
    document.removeEventListener('mouseup', this.mouseUp);
  },

  mouseDown: function mouseDown() {
    this.setState({
      mouseDown: true
    });
    document.addEventListener('mouseup', this.mouseUp);
  },

  touchEnd: function touchEnd() {
    this.highlightDate();
    this.selectDate();

    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false
      });
    }
    document.removeEventListener('touchend', this.touchEnd);
  },

  touchStart: function touchStart(event) {
    event.preventDefault();
    this.setState({
      mouseDown: true
    });
    document.addEventListener('touchend', this.touchEnd);
  },

  mouseEnter: function mouseEnter() {
    this.highlightDate();
  },

  mouseLeave: function mouseLeave() {
    if (this.state.mouseDown) {
      this.selectDate();

      this.setState({
        mouseDown: false
      });
    }
    this.unHighlightDate();
  },

  highlightDate: function highlightDate() {
    var _props = this.props;
    var date = _props.date;
    var selectionType = _props.selectionType;
    var selectedStartDate = _props.selectedStartDate;
    var onHighlightRange = _props.onHighlightRange;
    var onHighlightDate = _props.onHighlightDate;

    var datePair = undefined;
    var range = undefined;
    var forwards = undefined;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        datePair = _immutable2['default'].List.of(selectedStartDate, date).sortBy(function (d) {
          return d.unix();
        });
        range = _momentRange2['default']().range(datePair.get(0), datePair.get(1));
        forwards = range.start.unix() === selectedStartDate.unix();
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

  unHighlightDate: function unHighlightDate() {
    this.props.onUnHighlightDate(this.props.date);
  },

  selectDate: function selectDate() {
    var _props2 = this.props;
    var date = _props2.date;
    var selectionType = _props2.selectionType;
    var selectedStartDate = _props2.selectedStartDate;
    var completeRangeSelection = _props2.completeRangeSelection;
    var completeSelection = _props2.completeSelection;
    var startRangeSelection = _props2.startRangeSelection;

    if (selectionType === 'range') {
      if (selectedStartDate) {
        completeRangeSelection();
      } else if (!this.isDisabled(date) && this.isDateSelectable(date)) {
        startRangeSelection(date);
      }
    } else {
      if (!this.isDisabled(date) && this.isDateSelectable(date)) {
        completeSelection();
      }
    }
  },

  getBemModifiers: function getBemModifiers() {
    var _props3 = this.props;
    var date = _props3.date;
    var firstOfMonth = _props3.firstOfMonth;

    var otherMonth = false;
    var weekend = false;

    if (date.month() !== firstOfMonth.month()) {
      otherMonth = true;
    }

    if (date.day() === 0 || date.day() === 6) {
      weekend = true;
    }

    return { weekend: weekend, otherMonth: otherMonth };
  },

  getBemStates: function getBemStates() {
    var _props4 = this.props;
    var date = _props4.date;
    var value = _props4.value;
    var highlightedRange = _props4.highlightedRange;
    var highlightedDate = _props4.highlightedDate;
    var hideSelection = _props4.hideSelection;

    var disabled = this.isDisabled(date);
    var highlighted = false;
    var selected = false;

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
      selected = true;
    } else if (highlightedDate && date.isSame(highlightedDate)) {
      highlighted = true;
    }

    return { disabled: disabled, highlighted: highlighted, selected: selected };
  },

  render: function render() {
    var _props5 = this.props;
    var value = _props5.value;
    var date = _props5.date;
    var highlightedRange = _props5.highlightedRange;
    var highlightedDate = _props5.highlightedDate;
    var hideSelection = _props5.hideSelection;

    var bemModifiers = this.getBemModifiers();
    var bemStates = this.getBemStates();
    var pending = false;

    var color = undefined;
    var amColor = undefined;
    var pmColor = undefined;
    var states = this.dateRangesForDate(date);
    var numStates = states.count();
    var cellStyle = {};
    var style = {};

    var highlightModifier = null;
    var selectionModifier = null;

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
      pending = true;

      if (date.isSame(highlightedRange.start)) {
        selectionModifier = 'start';
      } else if (date.isSame(highlightedRange.end)) {
        selectionModifier = 'end';
      } else {
        selectionModifier = 'segment';
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
          borderLeftColor: _utilsLightenDarkenColor2['default'](color, -10),
          borderRightColor: _utilsLightenDarkenColor2['default'](color, -10)
        };
      }
    } else {
      amColor = states.getIn([0, 'color']);
      pmColor = states.getIn([1, 'color']);

      if (amColor) {
        cellStyle.borderLeftColor = _utilsLightenDarkenColor2['default'](amColor, -10);
      }

      if (pmColor) {
        cellStyle.borderRightColor = _utilsLightenDarkenColor2['default'](pmColor, -10);
      }
    }

    return _reactAddons2['default'].createElement(
      'td',
      { className: this.cx({ element: 'Date', modifiers: bemModifiers, states: bemStates }),
        style: cellStyle,
        onTouchStart: this.touchStart,
        onMouseOver: this.mouseOver,
        onMouseEnter: this.mouseEnter,
        onMouseLeave: this.mouseLeave,
        onMouseDown: this.mouseDown },
      numStates > 1 && _reactAddons2['default'].createElement(
        'div',
        { className: this.cx({ element: 'HalfDateStates' }) },
        _reactAddons2['default'].createElement(_CalendarDatePeriod2['default'], { period: 'am', color: amColor }),
        _reactAddons2['default'].createElement(_CalendarDatePeriod2['default'], { period: 'pm', color: pmColor })
      ),
      numStates === 1 && _reactAddons2['default'].createElement('div', { className: this.cx({ element: 'FullDateStates' }), style: style }),
      _reactAddons2['default'].createElement(
        'span',
        { className: this.cx({ element: 'DateLabel' }) },
        date.format('D')
      ),
      selectionModifier && _reactAddons2['default'].createElement(_CalendarSelection2['default'], { modifier: selectionModifier, pending: pending }),
      highlightModifier && _reactAddons2['default'].createElement(_CalendarHighlight2['default'], { modifier: highlightModifier })
    );
  }

});

exports['default'] = CalendarDate;
module.exports = exports['default'];