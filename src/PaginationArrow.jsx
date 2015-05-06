'use strict';
import React from 'react/addons';

import BemMixin from './utils/BemMixin';

const PureRenderMixin = React.addons.PureRenderMixin;


const PaginationArrow = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  propTypes: {
    disabled: React.PropTypes.bool,
    direction: React.PropTypes.oneOf(['next', 'previous'])
  },

  getDefaultProps() {
    return {
      disabled: false
    };
  },

  render() {
    let {disabled, direction, ...props} = this.props;
    let modifiers = {[direction]: true};
    let states = {disabled};

    let elementOpts = {
      modifiers,
      states
    };

    let iconOpts = {
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
