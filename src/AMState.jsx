'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var AMState = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var i;
    var classes = {
      'reactDaterangePicker__halfDay': true,
      'reactDaterangePicker__halfDay--am': true
    };
    if (this.props.availabilityAction) {
      classes['reactDaterangePicker__halfDay--is-' + this.props.availabilityAction] = true;
    }
    if (this.props.displayStates) {
      for (i = 0; i < this.props.displayStates.length; i++) {
        classes['reactDaterangePicker__halfDay--is-' + this.props.displayStates[i]] = true;
      }
    }

    return (
      <div className={cx(classes)} />
    );
  }
});

export default AMState;
