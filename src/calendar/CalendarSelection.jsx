'use strict';
import React from 'react/addons';

import BemMixin from '../utils/BemMixin';

var PureRenderMixin = React.addons.PureRenderMixin;


var CalendarSelection = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  render() {
    var {modifier, inOtherMonth, newSelectionStarted} = this.props;
    var modifiers = {[modifier]: true};
    var states = {
      newSelectionStarted,
      inOtherMonth
    };

    return (
      <div className={this.cx({states, modifiers})} />
    );
  }
});

export default CalendarSelection;
