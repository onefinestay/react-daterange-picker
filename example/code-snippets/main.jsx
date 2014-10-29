/* global React */
"use strict";

var RangePicker = require('react-daterange-picker');
var moment = require('moment-range');

var dateStates = [
  {
    state: 'unavailable',
    // unavailable for 5 days in 2 weeks time
    range: moment().range(
      moment().add(3, 'weeks'),
      moment().add(3, 'weeks')
        .add(5, 'days')
    ),
    selectable: false
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
    var defaultState = {
      selectable: true,
      state: 'available'
    };

    return (
      <RangePicker
        numberOfCalendars={2}
        dateStates={dateStates}
        defaultState={defaultState}
        value={this.state.value}
        onSelect={this.handleSelect} />
    );
  }
});
