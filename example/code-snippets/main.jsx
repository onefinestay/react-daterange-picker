/* global React */
"use strict";

var DateRangePicker = require('react-daterange-picker');
var moment = require('moment-range');

var stateDefinitions = {
  available: {
    color: null,
    label: 'Available'
  },
  enquire: {
    color: '#ffd200',
    label: 'Enquire'
  },
  unavailable: {
    selectable: false,
    color: '#78818b',
    label: 'Unavailable'
  }
};

var dateRanges = [
  {
    state: 'enquire',
    range: moment().range(
      moment().add(2, 'weeks').subtract(5, 'days'),
      moment().add(2, 'weeks').add(6, 'days')
    )
  },
  {
    state: 'unavailable',
    range: moment().range(
      moment().add(3, 'weeks'),
      moment().add(3, 'weeks').add(5, 'days')
    )
  }
];

var DatePicker = React.createClass({
  getInitialState: function() {
    return {
        value: null
    };
  },
  handleSelect: function(range, states) {
    // range is a moment-range object
    this.setState({
      value: range,
      states: states,
    });
  },

  render: function() {
    return (
      <DateRangePicker
        firstOfWeek={1}
        numberOfCalendars={2}
        selectionType='range'
        earliestDate={new Date()}
        stateDefinitions={stateDefinitions}
        dateStates={dateRanges}
        defaultState="available"
        showLegend={true}
        value={this.state.value}
        onSelect={this.handleSelect} />
    );
  }
});
