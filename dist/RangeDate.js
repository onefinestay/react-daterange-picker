"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var moment = _interopRequire(require("moment-range"));

var Immutable = _interopRequire(require("immutable"));

var AMState = _interopRequire(require("./AMState"));

var PMState = _interopRequire(require("./PMState"));

var HighlightEnd = _interopRequire(require("./HighlightEnd"));

var HighlightSegment = _interopRequire(require("./HighlightSegment"));

var HighlightSingle = _interopRequire(require("./HighlightSingle"));

var HighlightStart = _interopRequire(require("./HighlightStart"));

var SelectionEnd = _interopRequire(require("./SelectionEnd"));

var SelectionSegment = _interopRequire(require("./SelectionSegment"));

var SelectionSingle = _interopRequire(require("./SelectionSingle"));

var SelectionStart = _interopRequire(require("./SelectionStart"));

var lightenDarkenColor = _interopRequire(require("./lightenDarkenColor"));




var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var RangeDate = React.createClass({
  displayName: "RangeDate",
  mixins: [PureRenderMixin],

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
    var y = this.props.firstOfMonth.getFullYear();
    var m = this.props.firstOfMonth.getMonth();

    if (date.getMonth() !== m) {
      if (this.props.index < this.props.maxIndex && date.getTime() >= new Date(y, m + 1, 1).getTime()) {
        return true;
      }

      if (this.props.index > 0 && date.getTime() <= new Date(y, m, 1).getTime()) {
        return true;
      }
    }

    if (this.props.minDate && date.getTime() < this.props.minDate.getTime()) {
      return true;
    }
    if (this.props.maxDate && date.getTime() > this.props.maxDate.getTime()) {
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
    var datePair;
    var range;
    var forwards;

    if (this.props.selectedStartDate) {
      datePair = Immutable.List.of(this.props.selectedStartDate, date).sortBy(function (d) {
        return d.getTime();
      });
      range = moment().range(datePair.get(0), datePair.get(1));
      forwards = range.start.toDate().getTime() === this.props.selectedStartDate.getTime();
      range = this.sanitizeRange(range, forwards);
      this.props.onHighlightRange(range);
    } else {
      this.props.onHighlightDate(date);
    }
  },

  unHighlightDate: function unHighlightDate() {
    this.props.onUnHighlightDate(this.props.date);
  },

  selectDate: function selectDate() {
    var date = this.props.date;
    var datePair;
    var range;
    var forwards;
    var states;

    if (this.props.selectedStartDate) {
      // We already have one end of the range
      datePair = Immutable.List.of(this.props.selectedStartDate, date).sortBy(function (d) {
        return d.getTime();
      });
      range = moment().range(datePair.get(0), datePair.get(1));
      forwards = range.start.toDate().getTime() === this.props.selectedStartDate.getTime();

      range = this.sanitizeRange(range, forwards);

      if (range && range.end.diff(range.start, "days") > 0) {
        states = this.statesForRange(range);
        this.props.onCompleteSelection(range, states);
      }
    } else if (this.isDateSelectable(date)) {
      this.props.onStartSelection(date);
    }
  },

  getClasses: function getClasses(props) {
    var date = props.date;
    var isOtherMonth = false;
    var isWeekend = false;
    var isDisabled = this.isDisabled(date);

    if (date.getMonth() !== props.firstOfMonth.getMonth()) {
      isOtherMonth = true;
    }

    if (date.getDay() === 0 || date.getDay() === 6) {
      isWeekend = true;
    }


    return {
      reactDaterangePicker__date: true,
      "reactDaterangePicker__date--is-disabled": isDisabled,
      "reactDaterangePicker__date--is-weekend": isWeekend,
      "reactDaterangePicker__date--is-inOtherMonth": isOtherMonth
    };
  },

  getSegmentStates: function getSegmentStates(props) {
    var date = props.date;
    var isDisabled = this.isDisabled(date);
    var isOtherMonth = false;
    var amDisplayStates = [];
    var pmDisplayStates = [];

    if (date.getMonth() !== props.firstOfMonth.getMonth()) {
      isOtherMonth = true;
    }

    if (isDisabled) {
      amDisplayStates.push("disabled");
      pmDisplayStates.push("disabled");
    }

    if (isOtherMonth) {
      amDisplayStates.push("inOtherMonth");
      pmDisplayStates.push("inOtherMonth");
    }

    if (props.value && props.value.contains(date)) {
      if (props.value.start.toDate().getTime() === date.getTime()) {
        // It's the first day in the range, so only PM is selected
        pmDisplayStates.push("selected");
      } else if (props.value.end.toDate().getTime() === date.getTime()) {
        // It's the last day in the range, so only AM is selected
        amDisplayStates.push("selected");
      } else {
        // It's somewhere in the range, so AM and PM are selected
        amDisplayStates.push("selected");
        pmDisplayStates.push("selected");
      }
    }

    if (props.highlightedRange && props.highlightedRange.contains(date)) {
      if (props.highlightedRange.start.toDate().getTime() === date.getTime()) {
        pmDisplayStates.push("highlighted");
      } else if (props.highlightedRange.end.toDate().getTime() === date.getTime()) {
        amDisplayStates.push("highlighted");
      } else {
        amDisplayStates.push("highlighted");
        pmDisplayStates.push("highlighted");
      }
    }

    if (props.highlightedDate && !props.highlightedRange && date.getTime() === props.highlightedDate.getTime()) {
      amDisplayStates.push("highlighted");
      pmDisplayStates.push("highlighted");
    }

    return {
      am: Immutable.List(amDisplayStates),
      pm: Immutable.List(pmDisplayStates)
    };
  },

  render: function render() {
    var classes = this.getClasses(this.props);
    var date = moment(this.props.date);
    var color;
    var amColor;
    var pmColor;
    var states = this.dateRangesForDate(date);
    var numStates = states.count();
    var cellStyle = {};
    var style = {};
    var inSelection = false;
    var inHighlight = false;
    var isInOtherMonth = this.props.date.getMonth() !== this.props.firstOfMonth.getMonth();


    var HighlightComponent = null;
    var SelectionComponent = null;

    if (this.props.value) {
      if (!this.props.value.start) {
        if (date.isSame(this.props.value)) {
          SelectionComponent = SelectionSingle;
          inSelection = true;
        }
      } else if (this.props.value.start.isSame(this.props.value.end)) {
        if (date.isSame(this.props.value.start)) {
          SelectionComponent = SelectionSingle;
          inSelection = true;
        }
      } else {
        // It's a range
        if (this.props.value.contains(date)) {
          if (date.isSame(this.props.value.start)) {
            SelectionComponent = SelectionStart;
            inSelection = true;
          } else if (date.isSame(this.props.value.end)) {
            SelectionComponent = SelectionEnd;
            inSelection = true;
          } else {
            SelectionComponent = SelectionSegment;
            inSelection = true;
          }
        }
      }
    }

    if (this.props.highlightedRange && this.props.highlightedRange.contains(date)) {
      if (date.isSame(this.props.highlightedRange.start)) {
        HighlightComponent = HighlightStart;
        inHighlight = true;
      } else if (date.isSame(this.props.highlightedRange.end)) {
        HighlightComponent = HighlightEnd;
        inHighlight = true;
      } else {
        HighlightComponent = HighlightSegment;
        inHighlight = true;
      }
    }

    if (this.props.highlightedDate && date.isSame(this.props.highlightedDate)) {
      HighlightComponent = HighlightSingle;
      inHighlight = true;
    }

    if (inHighlight) {
      classes["reactDaterangePicker__date--is-inHighlight"] = true;
    }

    if (inSelection) {
      classes["reactDaterangePicker__date--is-inSelection"] = true;
    }

    if (!isInOtherMonth) {
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
    }

    return React.createElement(
      "td",
      { className: cx(classes),
        style: cellStyle,
        onMouseEnter: this.highlightDate,
        onMouseLeave: this.unHighlightDate,
        onClick: this.selectDate },
      !isInOtherMonth && numStates > 1 && React.createElement(
        "div",
        { className: "reactDaterangePicker__halfDateStates" },
        React.createElement(AMState, { color: amColor }),
        React.createElement(PMState, { color: pmColor })
      ),
      !isInOtherMonth && numStates === 1 && React.createElement("div", { className: "reactDaterangePicker__fullDateStates", style: style }),
      React.createElement(
        "span",
        { className: "reactDaterangePicker__dateLabel" },
        date.format("D")
      ),
      SelectionComponent && React.createElement(SelectionComponent, { date: date, isInOtherMonth: isInOtherMonth }),
      HighlightComponent && React.createElement(HighlightComponent, { date: date, isInOtherMonth: isInOtherMonth })
    );
  }

});

module.exports = RangeDate;