"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var moment = _interopRequire(require("moment-range"));

var Immutable = _interopRequire(require("immutable"));

var BemMixin = _interopRequire(require("../utils/BemMixin"));

var lightenDarkenColor = _interopRequire(require("../utils/lightenDarkenColor"));

var CalendarDatePeriod = _interopRequire(require("./CalendarDatePeriod"));

var CalendarHighlight = _interopRequire(require("./CalendarHighlight"));

var CalendarSelection = _interopRequire(require("./CalendarSelection"));




var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var RangeDate = React.createClass({
  displayName: "RangeDate",
  mixins: [BemMixin, PureRenderMixin],

  propTypes: {
    date: React.PropTypes.instanceOf(Date).isRequired,

    firstOfMonth: React.PropTypes.instanceOf(Date).isRequired,
    index: React.PropTypes.number.isRequired,
    maxIndex: React.PropTypes.number.isRequired,
    selectionType: React.PropTypes.string.isRequired,

    value: React.PropTypes.object,
    minDate: React.PropTypes.instanceOf(Date),
    maxDate: React.PropTypes.instanceOf(Date),
    highlightedRange: React.PropTypes.object,
    highlightedDate: React.PropTypes.instanceOf(Date),
    selectedStartDate: React.PropTypes.instanceOf(Date),
    dateStates: React.PropTypes.instanceOf(Immutable.List),

    onHighlightDate: React.PropTypes.func,
    onUnHighlightDate: React.PropTypes.func,
    onStartSelection: React.PropTypes.func,
    onCompleteSelection: React.PropTypes.func
  },

  isDisabled: function isDisabled(date) {
    var firstOfMonth = this.props.firstOfMonth;
    var maxIndex = this.props.maxIndex;
    var minDate = this.props.minDate;
    var maxDate = this.props.maxDate;


    var y = firstOfMonth.getFullYear();
    var m = firstOfMonth.getMonth();

    if (date.getMonth() !== m) {
      if (this.props.index < maxIndex && date.getTime() >= new Date(y, m + 1, 1).getTime()) {
        return true;
      }

      if (this.props.index > 0 && date.getTime() <= new Date(y, m, 1).getTime()) {
        return true;
      }
    }

    if (minDate && date.getTime() < minDate.getTime()) {
      return true;
    }
    if (maxDate && date.getTime() > maxDate.getTime()) {
      return true;
    }
    return false;
  },

  isDateSelectable: function isDateSelectable(date) {
    return this.dateRangesForDate(date).some(function (r) {
      return r.get("selectable");
    });
  },

  nonSelectableStateRanges: function nonSelectableStateRanges() {
    return this.props.dateStates.filter(function (d) {
      return !d.get("selectable");
    });
  },

  dateRangesForDate: function dateRangesForDate(date) {
    return this.props.dateStates.filter(function (d) {
      return d.get("range").contains(date);
    });
  },

  statesForRange: function statesForRange(range) {
    return this.props.dateStates.filter(function (d) {
      return d.get("range").intersect(range);
    }).map(function (d) {
      return d.get("state");
    });
  },

  sanitizeRange: function sanitizeRange(range, forwards) {
    /* Truncates the provided range at the first intersection
     * with a non-selectable state. Using forwards to determine
     * which direction to work
     */
    var blockedRanges = this.nonSelectableStateRanges();
    var intersect;

    if (forwards) {
      intersect = blockedRanges.find(function (r) {
        return range.intersect(r.get("range"));
      });
      if (intersect) {
        return moment().range(range.start, intersect.get("range").start);
      }
    } else {
      intersect = blockedRanges.findLast(function (r) {
        return range.intersect(r.get("range"));
      });

      if (intersect) {
        return moment().range(intersect.get("range").end, range.end);
      }
    }
    return range;
  },

  highlightDate: function highlightDate() {
    var date = this.props.date;
    var selectionType = this.props.selectionType;
    var selectedStartDate = this.props.selectedStartDate;
    var onHighlightRange = this.props.onHighlightRange;
    var onHighlightDate = this.props.onHighlightDate;
    var datePair;
    var range;
    var forwards;

    if (!this.isDisabled(date)) {
      if (selectionType === "range") {
        if (selectedStartDate) {
          datePair = Immutable.List.of(selectedStartDate, date).sortBy(function (d) {
            return d.getTime();
          });
          range = moment().range(datePair.get(0), datePair.get(1));
          forwards = range.start.toDate().getTime() === selectedStartDate.getTime();
          range = this.sanitizeRange(range, forwards);
          onHighlightRange(range);
        } else {
          onHighlightDate(date);
        }
      } else {
        onHighlightDate(date);
      }
    }
  },

  unHighlightDate: function unHighlightDate() {
    this.props.onUnHighlightDate(this.props.date);
  },

  selectDate: function selectDate() {
    var date = this.props.date;
    var selectionType = this.props.selectionType;
    var selectedStartDate = this.props.selectedStartDate;
    var onCompleteSelection = this.props.onCompleteSelection;
    var onStartSelection = this.props.onStartSelection;
    var onSelect = this.props.onSelect;
    var datePair;
    var range;
    var forwards;
    var states;

    if (selectionType === "range") {
      if (selectedStartDate) {
        // We already have one end of the range
        datePair = Immutable.List.of(selectedStartDate, date).sortBy(function (d) {
          return d.getTime();
        });
        range = moment().range(datePair.get(0), datePair.get(1));
        forwards = range.start.toDate().getTime() === selectedStartDate.getTime();

        range = this.sanitizeRange(range, forwards);

        if (range && range.end.diff(range.start, "days") > 0) {
          states = this.statesForRange(range);
          onCompleteSelection(range, states);
        }
      } else if (this.isDateSelectable(date)) {
        onStartSelection(date);
      }
    } else {
      if (!this.isDisabled(date)) {
        onSelect(date);
      }
    }
  },

  getBemModifiers: function getBemModifiers() {
    var date = this.props.date;
    var firstOfMonth = this.props.firstOfMonth;


    var otherMonth = false;
    var weekend = false;

    if (date.getMonth() !== firstOfMonth.getMonth()) {
      otherMonth = true;
    }

    if (date.getDay() === 0 || date.getDay() === 6) {
      weekend = true;
    }

    return { weekend: weekend, otherMonth: otherMonth };
  },

  getBemStates: function getBemStates() {
    var date = this.props.date;
    var value = this.props.value;
    var highlightedRange = this.props.highlightedRange;
    var highlightedDate = this.props.highlightedDate;
    var dateMoment = moment(date);
    var disabled = this.isDisabled(date);
    var highlighted = false;
    var selected = false;

    if (value) {
      if (!value.start && dateMoment.isSame(value)) {
        selected = true;
      } else if (value.start && value.start.isSame(value.end) && dateMoment.isSame(value.start)) {
        selected = true;
      } else if (value.start && value.contains(dateMoment)) {
        selected = true;
      }
    }

    if (highlightedRange && highlightedRange.contains(dateMoment)) {
      highlighted = true;
    } else if (highlightedDate && dateMoment.isSame(highlightedDate)) {
      highlighted = true;
    }

    return { disabled: disabled, highlighted: highlighted, selected: selected };
  },

  render: function render() {
    var value = this.props.value;
    var firstOfMonth = this.props.firstOfMonth;
    var date = this.props.date;
    var highlightedRange = this.props.highlightedRange;
    var highlightedDate = this.props.highlightedDate;
    var dateMoment = moment(date);

    var bemModifiers = this.getBemModifiers();
    var bemStates = this.getBemStates();

    var color;
    var amColor;
    var pmColor;
    var states = this.dateRangesForDate(date);
    var numStates = states.count();
    var cellStyle = {};
    var style = {};

    var highlightModifier = null;
    var selectionModifier = null;

    if (value && value.start) {
      if (value.start.isSame(value.end)) {
        selectionModifier = "single";
      } else if (value.contains(dateMoment)) {
        if (dateMoment.isSame(value.start)) {
          selectionModifier = "start";
        } else if (dateMoment.isSame(value.end)) {
          selectionModifier = "end";
        } else {
          selectionModifier = "segment";
        }
      }
    } else if (value && dateMoment.isSame(value)) {
      selectionModifier = "single";
    }

    if (highlightedRange && highlightedRange.contains(dateMoment)) {
      if (dateMoment.isSame(highlightedRange.start)) {
        highlightModifier = "start";
      } else if (dateMoment.isSame(highlightedRange.end)) {
        highlightModifier = "end";
      } else {
        highlightModifier = "segment";
      }
    }

    if (highlightedDate && dateMoment.isSame(highlightedDate)) {
      highlightModifier = "single";
    }

    if (numStates === 1) {
      // If there's only one state, it means we're not at a boundary
      color = states.getIn([0, "color"]);

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
      amColor = states.getIn([0, "color"]);
      pmColor = states.getIn([1, "color"]);

      if (amColor) {
        cellStyle.borderLeftColor = lightenDarkenColor(amColor, -10);
      }

      if (pmColor) {
        cellStyle.borderRightColor = lightenDarkenColor(pmColor, -10);
      }
    }

    return React.createElement(
      "td",
      { className: this.cx({ element: "Date", modifiers: bemModifiers, states: bemStates }),
        style: cellStyle,
        onMouseEnter: this.highlightDate,
        onMouseLeave: this.unHighlightDate,
        onClick: this.selectDate },
      numStates > 1 && React.createElement(
        "div",
        { className: this.cx({ element: "HalfDateStates" }) },
        React.createElement(CalendarDatePeriod, { period: "am", color: amColor }),
        React.createElement(CalendarDatePeriod, { period: "pm", color: pmColor })
      ),
      numStates === 1 && React.createElement("div", { className: this.cx({ element: "FullDateStates" }), style: style }),
      React.createElement(
        "span",
        { className: this.cx({ element: "DateLabel" }) },
        dateMoment.format("D")
      ),
      selectionModifier && React.createElement(CalendarSelection, { modifier: selectionModifier }),
      highlightModifier && React.createElement(CalendarHighlight, { modifier: highlightModifier })
    );
  }

});

module.exports = RangeDate;