'use strict';
import React from 'react/addons';

import BemMixin from './utils/BemMixin';

var PureRenderMixin = React.addons.PureRenderMixin;


var PaginationArrow = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  render() {
    var {disabled, direction, ...props} = this.props;
    var modifiers = {[direction]: true};
    var states = {disabled};

    var elementOpts = {
      modifiers,
      states
    };

    var iconOpts = {
      element: 'PaginationArrowIcon',
      modifiers,
      states
    };

    return (
      <div className={this.cx(elementOpts)} {...props}>
        <div className={this.cx(iconOpts)} />
      </div>
    );
  }
});

export default PaginationArrow;
