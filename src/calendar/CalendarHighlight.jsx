'use strict';
import React from 'react/addons';

import BemMixin from '../utils/BemMixin';

var PureRenderMixin = React.addons.PureRenderMixin;


var CalendarHighlight = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  render() {
    var {modifier, inOtherMonth} = this.props;
    var modifiers = {[modifier]: true};
    var states = {
      inOtherMonth
    };

    return (
      <div className={this.cx({states, modifiers})} />
    );
  }
});

export default CalendarHighlight;