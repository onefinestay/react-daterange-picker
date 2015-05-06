'use strict';
import React from 'react/addons';

import BemMixin from '../utils/BemMixin';

const PureRenderMixin = React.addons.PureRenderMixin;


const CalendarSelection = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  render() {
    let {modifier, inOtherMonth, newSelectionStarted, pending} = this.props;
    let modifiers = {[modifier]: true};
    let states = {
      pending,
      newSelectionStarted,
      inOtherMonth
    };

    return (
      <div className={this.cx({states, modifiers})} />
    );
  }
});

export default CalendarSelection;
