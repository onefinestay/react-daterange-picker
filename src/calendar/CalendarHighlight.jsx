'use strict';
import React from 'react/addons';

import BemMixin from '../utils/BemMixin';
import PureRenderMixin from '../utils/PureRenderMixin';


const CalendarHighlight = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  render() {
    let {modifier} = this.props;
    let modifiers = {[modifier]: true};
    let states = {};

    return (
      <div className={this.cx({states, modifiers})} />
    );
  }
});

export default CalendarHighlight;
