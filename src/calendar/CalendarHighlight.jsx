import React from 'react';

import BemMixin from '../utils/BemMixin';
import PureRenderMixin from '../utils/PureRenderMixin';


const CalendarHighlight = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  propTypes: {
    modifier: React.PropTypes.string,
  },

  render() {
    let {modifier} = this.props;
    let modifiers = {[modifier]: true};
    let states = {};

    return (
      <div className={this.cx({states, modifiers})} />
    );
  },
});

export default CalendarHighlight;
