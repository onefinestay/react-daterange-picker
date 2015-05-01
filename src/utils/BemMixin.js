import React from 'react';
import bemCx from './bemCx';

import assign from 'object.assign';

var BemMixin = {
  propTypes: {
    bemNamespace: React.PropTypes.string,
    bemBlock: React.PropTypes.string
  },

  contextTypes: {
    bemNamespace: React.PropTypes.string,
    bemBlock: React.PropTypes.string
  },

  childContextTypes: {
    bemNamespace: React.PropTypes.string,
    bemBlock: React.PropTypes.string
  },

  getChildContext() {
    return {
      bemNamespace: this.getBemNamespace(),
      bemBlock: this.getBemBlock()
    };
  },

  getBemNamespace() {
    if (this.props.bemNamespace) {
      return this.props.bemNamespace;
    }
    if (this.context.bemNamespace) {
      return this.context.bemNamespace;
    }
    return null;
  },

  getBemBlock() {
    if (this.props.bemBlock) {
      return this.props.bemBlock;
    }
    if (this.context.bemBlock) {
      return this.context.bemBlock;
    }
    return null;
  },

  cx(options={}) {
    var opts = {
      namespace: this.getBemNamespace(),
      element: this.constructor.displayName,
      block: this.getBemBlock(),
    };

    assign(opts, options);
    return bemCx(opts);
  }
};

export default BemMixin;
