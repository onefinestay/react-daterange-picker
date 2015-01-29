'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var PMState = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var style = {};
    var classes = {
      'reactDaterangePicker__halfDay': true,
      'reactDaterangePicker__halfDay--pm': true
    };
    if (this.props.color) {
      style['backgroundColor'] = this.props.color;
    }

    return (
      <div style={style} className={cx(classes)} />
    );
  }
});

export default PMState;
