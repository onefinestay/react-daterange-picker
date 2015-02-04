'use strict';
import React from 'react/addons';
import BemMixin from '../utils/BemMixin';

var PureRenderMixin = React.addons.PureRenderMixin;

var CalendarDatePeriod = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  render() {
    var {color, period} = this.props;
    var modifiers = {[period]: true};
    var style;

    if (color) {
      style= {backgroundColor: color};
    }

    return (
      <div style={style} className={this.cx({modifiers})} />
    );
  }
});

export default CalendarDatePeriod;
