"use strict";

var React = require('react/addons');
var Calendar = require('../../src/calendar.jsx');

window.React = React;

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
            })
        );
    }
});

React.renderComponent(DatePicker(), document.getElementById('calendar'));
