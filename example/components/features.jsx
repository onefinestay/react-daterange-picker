/** @jsx React.DOM */
"use strict";

var React = require('react/addons');

var Features = React.createClass({
  render: function() {
    return (
      <div className="features">
        <h2>Features</h2>
        <ul className="features__list">
          <li className="features__point">Amazing - Will transform your life.</li>
          <li className="features__point">Revolutionary - No one has ever thought of doing this. Ever.</li>
          <li className="features__point">Mind blowing - Boom.</li>
        </ul>
      </div>
    );
  }
});

module.exports = Features;
