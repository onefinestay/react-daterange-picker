/* global hljs */
"use strict";

var React = require('react/addons');
var Index = React.createFactory(require('../index.jsx'));

window.React = React;

React.render(
  Index(),
  document
);
