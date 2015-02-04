'use strict';
import React from 'react/addons';

import BemMixin from '../utils/BemMixin';

var PureRenderMixin = React.addons.PureRenderMixin;


var CalendarSelection = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  render() {
    var {modifier, inOtherMonth} = this.props;
    var element = 'CalendarSelection';
    var modifiers = {[modifier]: true};
    var states = {
      inOtherMonth
    };

    return (
      <div className={this.cx({element, states, modifiers})} />
    );
  }
});

export default CalendarSelection;
