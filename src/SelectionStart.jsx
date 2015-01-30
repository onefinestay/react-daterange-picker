'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var SelectionStart = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var classes = {
      'reactDaterangePicker__selection': true,
      'reactDaterangePicker__selection--start': true,
      'reactDaterangePicker__selection--is-inOtherMonth': this.props.isInOtherMonth
    };

    return (
      <div className={cx(classes)} />
    );
  }
});

export default SelectionStart;
