/** @jsx React.DOM */
"use strict";

var React = require('react/addons');
var CodeSnippet = require('./code-snippet');

var Install = React.createClass({
  render: function() {
    return (
      <div className="install">
        <h2>Install</h2>
        <CodeSnippet language="bash" toggle={false}>
          npm install react-daterange-picker
        </CodeSnippet>
      </div>
    );
  }
});

module.exports = Install;
