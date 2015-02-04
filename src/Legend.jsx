'use strict';
import React from 'react/addons';

import bemCx from './utils/bemCx';
import BemMixin from './utils/BemMixin';

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var Legend = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  render() {
    var {stateDefinitions} = this.props;
    var block = this.getBemBlock();
    var namespace = this.getBemNamespace();
    var items = [];
    var name;
    var def;
    var style;

    for (name in stateDefinitions) {
      def = stateDefinitions[name];
      if (def.label && def.color) {
        style = {
          backgroundColor: def.color
        };
        items.push(
          <li className={this.cx({element: 'LegendItem'})} key={name}>
            <span className={this.cx({element: 'LegendItemColor'})} style={style} />
            <span className={this.cx({element: 'LegendItemLabel'})}>{def.label}</span>
          </li>
        );
      }
    }

    return (
      <ul className={this.cx({element: 'Legend'})}>
        <li className={this.cx({element: 'LegendItem'})}>
          <span className={this.cx({element: 'LegendItemColor', modifiers: {'selection': true}})} />
          <span className={this.cx({element: 'LegendItemLabel'})}>Your selected dates</span>
        </li>
        {items}
      </ul>
    );
  }
});

export default Legend;
