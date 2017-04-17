import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';

import BemMixin from '../utils/BemMixin';
import PureRenderMixin from '../utils/PureRenderMixin';


const CalendarSelection = createClass({
  mixins: [BemMixin, PureRenderMixin],

  propTypes: {
    modifier: PropTypes.string,
    pending: PropTypes.bool.isRequired,
  },

  render() {
    let {modifier, pending} = this.props;
    let modifiers = {[modifier]: true};
    let states = {
      pending,
    };

    return (
      <div className={this.cx({states, modifiers})} />
    );
  },
});

export default CalendarSelection;
