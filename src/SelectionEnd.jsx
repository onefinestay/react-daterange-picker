'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var SelectionEnd = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var classes = {
      'reactDaterangePicker__selection': true,
      'reactDaterangePicker__selection--end': true,
      'reactDaterangePicker__selection--is-inOtherMonth': this.props.isInOtherMonth
    };

    return (
      <div className={cx(classes)} />
    );
  }
});

export default SelectionEnd;
