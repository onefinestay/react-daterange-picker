import React from 'react';

const Selection = React.createClass({
  propTypes: {
    className: React.PropTypes.string.isRequired,
    date: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    label: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  onSelect() {
    this.props.onSelect(this.props.date);
  },

  render() {
    return (
      <input className={this.props.className}
             type='button'
             onClick={this.onSelect}
             disabled={this.props.disabled}
             value={this.props.label} />
    );
  },
});

export default Selection;
