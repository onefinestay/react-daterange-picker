import React from 'react';

import PropTypes from 'prop-types';
import BemMixin from './utils/BemMixin';

import PureRenderMixin from 'react-addons-pure-render-mixin';


const PaginationArrow = React.createClass({
  mixins: [BemMixin, PureRenderMixin],

  propTypes: {
    disabled: PropTypes.bool,
    onTrigger: PropTypes.func,
    direction: PropTypes.oneOf(['next', 'previous']),
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  render() {
    let {disabled, direction, onTrigger, ...props} = this.props;
    let modifiers = {[direction]: true};
    let states = {disabled};

    let elementOpts = {
      modifiers,
      states,
    };

    let iconOpts = {
      element: 'PaginationArrowIcon',
      modifiers,
      states,
    };

    return (
      <div className={this.cx(elementOpts)} {...props} onClick={onTrigger}>
        <div className={this.cx(iconOpts)} />
      </div>
    );
  },
});

export default PaginationArrow;
