"use strict";

var React = require('react/addons');
var Calendar = require('../../src/calendar.jsx');
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
    range: moment().range(moment().add(28, 'days'), moment().add(30, 'days')),
    state: 'unavailable',
    selectable: false
  },
  {
    range: moment().range(moment().add(30, 'days'), moment().add(50, 'days')),
    state: 'available',
    selectable: true
  },
];

var DatePicker = React.createClass({
  getInitialState: function() {
    return {
      value: null
    };
  },
  handleSelect: function(range) {
    console.log(range);
    this.setState({
      value: range
    });
  },
  render: function() {
    return React.DOM.div({},
      Calendar({
        numberOfCalendars: 2,
        selectionType: 'range',
        onSelect: this.handleSelect,
        value: this.state.value,
        earliestDate: new Date(),
        allowedDates: dateRanges,
      })
    );
  }
});

React.renderComponent(DatePicker(), document.getElementById('calendar'));
