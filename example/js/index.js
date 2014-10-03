"use strict";

var React = require('react/addons');
var RangePicker = require('../../src/range-picker.jsx');
var moment = require('moment-range');

window.React = React;

var dateRanges = [
  {
    range: moment().range(moment(), moment().add(14, 'days')),
    state: 'available',
    selectable: true
  },
  {
    range: moment().range(moment().add(14, 'days'), moment().add(28, 'days')),
    state: 'enquire',
    selectable: true
  },
  {
    range: moment().range(moment().add(28, 'days'), moment().add(31, 'days')),
    state: 'unavailable',
    selectable: false
  },
  {
    range: moment().range(moment().add(31, 'days'), moment().add(50, 'days')),
    state: 'available',
    selectable: true
  },
];

var DatePickerRange = React.createClass({
  getInitialState: function() {
    return {
      start: null,
      end: null,
    };
  },
  handleSelect: function(range) {
    this.setState({
      start: range.start,
      end: range.end
    });
  },
  render: function() {
    var range;

    if (this.state.start && this.state.end) {
      range = moment().range(this.state.start, this.state.end);
    }

    return React.DOM.div({},
      this.transferPropsTo(
        RangePicker({
          onSelect: this.handleSelect,
          value: range
        })
      ),
      React.DOM.div(null,
        React.DOM.input({
          type: 'text',
          value: this.state.start ? this.state.start.format('LL') : null,
          readOnly: true
        }, null),
        React.DOM.input({
          type: 'text',
          value: this.state.end ? this.state.end.format('LL') : null,
          readOnly: true
        }, null)
      )
    );
  }
});

var DatePickerSingle = React.createClass({
  getInitialState: function() {
    return {
      value: null,
    };
  },
  handleSelect: function(value) {
    this.setState({
      value: value,
    });
  },
  render: function() {
    return React.DOM.div({},
      this.transferPropsTo(
        RangePicker({
          onSelect: this.handleSelect,
          value: this.state.value
        })
      ),
      React.DOM.div(null,
        React.DOM.input({
          type: 'text',
          value: this.state.value ? this.state.value.format('LL') : null,
          readOnly: true
        }, null)
      )
    );
  }
});

React.renderComponent(
  DatePickerRange({
    numberOfCalendars: 2,
    selectionType: 'range',
    earliestDate: new Date(),
    dateStates: dateRanges,
  }),
  document.getElementById('range-picker')
);

React.renderComponent(
  DatePickerRange({
    numberOfCalendars: 2,
    selectionType: 'range',
    earliestDate: new Date(),
  }),
  document.getElementById('range-picker-no-states')
);

React.renderComponent(
  DatePickerSingle({
    numberOfCalendars: 2,
    selectionType: 'single',
    earliestDate: new Date(),
  }),
  document.getElementById('single-picker-no-states')
);
