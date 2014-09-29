"use strict";

var React = require('react/addons');
var Calendar = require('../../src/calendar.jsx');

window.React = React;

React.renderComponent(
    Calendar({
        numberOfCalendars: 2,
        selectionType: 'range',
    }),
    document.getElementById('calendar')
);
