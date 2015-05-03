"use strict";

var React = require('react/addons');

var Header = React.createClass({
  render: function() {
    return (
      <header className="header">
        <h1 className="header__title">React Daterange Picker</h1>
      </header>
    );
  }
});

module.exports = Header;
