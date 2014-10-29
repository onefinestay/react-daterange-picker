/* global hljs */
"use strict";

var React = require('react/addons');
var Homepage = require('../index.jsx');

window.React = React;

React.renderComponent(
  Homepage(),
  document
);
