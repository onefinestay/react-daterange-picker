"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var moment = _interopRequire(require("moment-range"));

var Immutable = _interopRequire(require("immutable"));

var AMState = _interopRequire(require("./AMState"));

var PMState = _interopRequire(require("./PMState"));

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
    var dateRanges = this.dateRangesForDate(date);
    var defaultState = this.props.defaultState;
    var state;
    var start;
    var end;


    if (dateRanges.count() === 0 && defaultState.selectable) {
      return true;
    } else {
      // if one date range and date is at the start or end of it then return
      // defaultState
      if (dateRanges.count() === 1) {
        state = dateRanges.get(0);
        start = state.get("range").start.toDate();
        end = state.get("range").end.toDate();
        if (start.getTime() == date.getTime() || end.getTime() == date.getTime()) {
          return defaultState.selectable === true;
        }
      }

      if (dateRanges.some(function (r) {
        return r.get("selectable");
      })) {
        return true;
      }
    }
    return false;
  },

  nonSelectableStateRanges: function nonSelectableStateRanges() {
    return this.props.dateStates.filter(function (d) {
      return !d.get("selectable");
    }).map(function (dates) {
      var newStart = new Date(dates.get("range").start);
      var newEnd = new Date(dates.get("range").end);
      newStart.setDate(newStart.getDate());
      newEnd.setDate(newEnd.getDate());
      return Immutable.Map({
        range: moment().range(newStart, newEnd),
        state: dates.get("state"),
        selectable: dates.get("selectable")
      });
    }).valueSeq();
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
    var isSelected = false;
    var isSelectedRange = false;
    var isHighlightedRange = false;
    var isHighlighted = false;

    var isDisabled = this.isDisabled(date);
    var range = null;

    var time = date.getTime();

    if (date.getMonth() !== props.firstOfMonth.getMonth()) {
      isOtherMonth = true;
    }

    if (!isDisabled) {
      if (props.value) {
        if (props.selectionType === "range" && props.value.contains(date)) {
          isSelectedRange = true;
        } else if (props.selectionType === "single" && props.value.getTime() === time) {
          isSelected = true;
        }
      }

      // Highlights (Hover states)
      if (props.highlightedDate && props.highlightedDate.getTime() === time) {
        isHighlighted = true;
      }

      if (props.highlightedRange) {
        if (props.highlightedRange.contains(date)) {
          isHighlightedRange = true;
        }
      }
    }

    return {
      reactDaterangePicker__date: true,
      "reactDaterangePicker__date--is-selected": isSelected,
      "reactDaterangePicker__date--is-inSelectedRange": isSelectedRange,
      "reactDaterangePicker__date--is-highlighted": isHighlighted,
      "reactDaterangePicker__date--is-inHighlightedRange": isHighlightedRange,
      "reactDaterangePicker__date--is-disabled": isDisabled,
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
      am: amDisplayStates,
      pm: pmDisplayStates
    };
  },

  render: function render() {
    var classes = this.getClasses(this.props);
    var date = this.props.date;
    var amAction;
    var pmAction;
    var states = this.dateRangesForDate(date);
    var defaultState = this.props.defaultState;
    var state;
    var start;
    var end;
    var segmentStates;

    if (states.count() > 0) {
      if (states.count() === 1) {
        // If there's only one state, it means we're not at a boundary
        state = states.get(0);
        start = state.get("range").start.toDate();
        end = state.get("range").end.toDate();

        if (!defaultState) {
          amAction = state.get("state");
          pmAction = state.get("state");
        } else {
          // start of range
          if (start.getTime() == date.getTime()) {
            amAction = defaultState.state;
            pmAction = state.get("state");
          } else if (end.getTime() == date.getTime()) {
            amAction = state.get("state");
            pmAction = defaultState.state;
          } else {
            amAction = state.get("state");
            pmAction = state.get("state");
          }
        }
      } else {
        amAction = states.getIn([0, "state"]);
        pmAction = states.getIn([1, "state"]);
      }
    } else if (defaultState && defaultState.state) {
      amAction = defaultState.state;
      pmAction = defaultState.state;
    }

    segmentStates = this.getSegmentStates(this.props);

    return React.createElement(
      "td",
      { className: cx(classes),
        onMouseEnter: this.highlightDate,
        onMouseLeave: this.unHighlightDate,
        onClick: this.selectDate },
      React.createElement(AMState, { displayStates: segmentStates.am, availabilityAction: amAction }),
      React.createElement(PMState, { displayStates: segmentStates.pm, availabilityAction: pmAction }),
      React.createElement(
        "span",
        { className: "reactDaterangePicker__dateLabel" },
        this.props.date.getDate()
      )
    );
  }

});

module.exports = RangeDate;