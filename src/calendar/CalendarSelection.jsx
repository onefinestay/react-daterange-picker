import React from 'react';

import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import BemMixin from '../utils/BemMixin';
import PureRenderMixin from '../utils/PureRenderMixin';


const CalendarSelection = createClass({
  mixins: [BemMixin, PureRenderMixin],
  displayName: "CalendarSelection",

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
