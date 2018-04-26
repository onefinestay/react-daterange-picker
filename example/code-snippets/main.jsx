import React from 'react';

import createClass from 'create-react-class';
import DateRangePicker from 'react-daterange-picker';
import moment from '../moment-range';

const stateDefinitions = {
  available: {
    color: null,
    label: 'Available',
  },
  enquire: {
    color: '#ffd200',
    label: 'Enquire',
  },
  unavailable: {
    selectable: false,
    color: '#78818b',
    label: 'Unavailable',
  },
};

const dateRanges = [
  {
    state: 'enquire',
    range: moment.range(
      moment().add(2, 'weeks').subtract(5, 'days'),
      moment().add(2, 'weeks').add(6, 'days')
    ),
  },
  {
    state: 'unavailable',
    range: moment.range(
      moment().add(3, 'weeks'),
      moment().add(3, 'weeks').add(5, 'days')
    ),
  },
];

const DatePicker = createClass({
  getInitialState() {
    return {
      value: null,
    };
  },
  handleSelect(range, states) {
    // range is a moment-range object
    this.setState({
      value: range,
      states: states,
    });
  },

  render() {
    return (
      <DateRangePicker
        firstOfWeek={1}
        numberOfCalendars={2}
        selectionType='range'
        minimumDate={new Date()}
        stateDefinitions={stateDefinitions}
        dateStates={dateRanges}
        defaultState="available"
        showLegend={true}
        value={this.state.value}
        onSelect={this.handleSelect} />
    );
  },
});


export default DatePicker;
