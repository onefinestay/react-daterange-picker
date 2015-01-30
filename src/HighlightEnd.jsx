'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var HighlightEnd = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var classes = {
      'reactDaterangePicker__highlight': true,
      'reactDaterangePicker__highlight--end': true,
      'reactDaterangePicker__highlight--is-inOtherMonth': this.props.isInOtherMonth
    };

    return (
      <div className={cx(classes)} />
    );
  }
});

export default HighlightEnd;
