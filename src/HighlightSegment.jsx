'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var HightlightSegment = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className="reactDaterangePicker__highlight reactDaterangePicker__highlight--segment" />
    );
  }
});

export default HightlightSegment;
