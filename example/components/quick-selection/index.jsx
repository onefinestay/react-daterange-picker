import React from 'react';

import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import _ from 'underscore';
import Selection from './selection';

const QuickSelection = createClass({
  propTypes: {
    dates: PropTypes.object.isRequired,
    value: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
  },

  isCurrentlySelected(date) {
    const { value } = this.props;

    if (!value) {
      return false;
    }

    return date.isSame(value);
  },

  renderSelections() {
    return _.map(this.props.dates, (date, label) => {
      return (
        <Selection key={label}
                   className='quickSelection__selection'
                   onSelect={this.props.onSelect}
                   date={date}
                   disabled={this.isCurrentlySelected(date)}
                   label={label} />
      );
    });
  },

  render() {
    return (
      <div className='quickSelection'>
        {this.renderSelections()}
      </div>
    );
  },
});

export default QuickSelection;
