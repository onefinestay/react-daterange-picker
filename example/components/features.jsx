import React from 'react';

const Features = React.createClass({
  render() {
    return (
      <div className="features">
        <h2>Features</h2>
        <ul className="features__list">
          <li className="features__point">
            Select a date range in an intuitive way.
          </li>
          <li className="features__point">
            Define date ranges that are not available for selection.
          </li>
          <li className="features__point">
            Show any number of months at the same time.
          </li>
          <li className="features__point">
            Visually represent half day states.
          </li>
        </ul>
      </div>
    );
  },
});

export default Features;
