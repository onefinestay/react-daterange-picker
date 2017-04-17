import React from 'react';
import createClass from 'create-react-class';

import BemMixin from '../utils/BemMixin';
import PureRenderMixin from '../utils/PureRenderMixin';


const CalendarDatePeriod = createClass({
  mixins: [BemMixin, PureRenderMixin],

  propTypes: {
    color: React.PropTypes.string,
    period: React.PropTypes.string,
  },

  render() {
    let {color, period} = this.props;
    let modifiers = {[period]: true};
    let style;

    if (color) {
      style = {backgroundColor: color};
    }

    return (
      <div style={style} className={this.cx({modifiers})} />
    );
  },
});

export default CalendarDatePeriod;
