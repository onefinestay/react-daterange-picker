import React from 'react';
import createClass from 'create-react-class';
import _ from 'underscore';
import Selection from './selection';

const QuickSelection = createClass({
  propTypes: {
    dates: React.PropTypes.object.isRequired,
    value: React.PropTypes.object,
    onSelect: React.PropTypes.func.isRequired,
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
