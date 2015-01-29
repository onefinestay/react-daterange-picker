'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var SelectionSegment = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className="reactDaterangePicker__selection reactDaterangePicker__selection--segment" />
    );
  }
});

export default SelectionSegment;
