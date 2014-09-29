"use strict";

var React = require('react/addons');
var Calendar = require('../../src/calendar.jsx');

React.renderComponent(
    Calendar(),
    document.getElementById('calendar')
);
