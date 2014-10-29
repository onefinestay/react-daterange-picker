/* global moment, React */
"use strict";

module.exports = function() {
var RangePicker = require('react-daterange-picker');
var moment = require('moment-range');

var dateStates = [
  {
    state: 'available',
    range: moment().range(
      moment(),
      moment().add(2, 'weeks')
    ),
    selectable: true
  },
  {
    state: 'enquire',
    range: moment().range(
      moment().add(2, 'weeks'),
      moment().add(3, 'weeks')
    ),
    selectable: true
  },
  {
    state: 'unavailable',
    range: moment().range(
      moment().add(3, 'weeks'),
      moment().add(3, 'weeks')
        .add(5, 'days')
    ),
    selectable: false
  },
  {
    state: 'available',
    range: moment().range(
      moment().add(3, 'weeks')
        .add(5, 'days'),
      moment().add(10, 'weeks')
    ),
    selectable: true
  }
];

var DatePicker = React.createClass({
  getInitialState: function() {
    return {
        value: null
    };
  },
  handleSelect: function(range) {
    // range is a moment-range object
    this.setState({
        value: range
    });
  },
  render: function() {
    return RangePicker({
      numberOfCalendars: 2,
      dateStates: dateStates,
      value: this.state.value,
      onSelect: this.handleSelect
    });
  }
});
};
