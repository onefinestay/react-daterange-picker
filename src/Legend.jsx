'use strict';
import React from 'react/addons';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var Legend = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var items = [];
    var name;
    var def;
    var style;

    for (name in this.props.stateDefinitions) {
      def = this.props.stateDefinitions[name];
      if (def.label && def.color) {
        style = {
          backgroundColor: def.color
        };
        items.push(
          <li className="reactDaterangePicker__legendItem">
            <span className="reactDaterangePicker__legendItemColor" style={style} />
            <span className="reactDaterangePicker__legendItemLabel">{def.label}</span>
          </li>
        );
      }
    }

    return (
      <ul className="reactDaterangePicker__legend">
        <li className="reactDaterangePicker__legendItem reactDaterangePicker__legendItem">
          <span className="reactDaterangePicker__legendItemColor reactDaterangePicker__legendItemColor--selection" />
          <span className="reactDaterangePicker__legendItemLabel">Your selected dates</span>
        </li>
        {items}
      </ul>
    );
  }
});

export default Legend;
