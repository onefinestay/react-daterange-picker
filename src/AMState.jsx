'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var AMState = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var style = {};
    var classes = {
      'reactDaterangePicker__halfDay': true,
      'reactDaterangePicker__halfDay--am': true
    };
    if (this.props.color) {
      style['backgroundColor'] = this.props.color;
    }

    return (
      <div style={style} className={cx(classes)} />
    );
  }
});

export default AMState;
