"use strict";

var React = require('react/addons');
var Calendar = require('../../src/calendar.jsx');
var moment = require('moment-range');

window.React = React;

var allowedDates = [
  {
    range: moment().range(moment(), moment().add(7, 'days')),
    state: 'available',
    selectable: true
  }
];

var DatePicker = React.createClass({
  getInitialState: function() {
    return {
      value: null
    };
  },
  handleSelect: function(date) {
    this.setState({
      value: date.toDate()
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
        allowedDates: allowedDates,
      })
    );
  }
});

React.renderComponent(DatePicker(), document.getElementById('calendar'));
