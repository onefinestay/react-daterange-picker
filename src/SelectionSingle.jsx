'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var SelectionSingle = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var classes = {
      'reactDaterangePicker__selection': true,
      'reactDaterangePicker__selection--single': true,
      'reactDaterangePicker__selection--is-inOtherMonth': this.props.isInOtherMonth
    };

    return (
      <div className={cx(classes)} />
    );
  }
});

export default SelectionSingle;
