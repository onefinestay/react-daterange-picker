import bemCx from './bemCx';
import PropTypes from 'prop-types';

const BemMixin = {
  propTypes: {
    bemNamespace: PropTypes.string,
    bemBlock: PropTypes.string,
  },

  contextTypes: {
    bemNamespace: PropTypes.string,
    bemBlock: PropTypes.string,
  },

  childContextTypes: {
    bemNamespace: PropTypes.string,
    bemBlock: PropTypes.string,
  },

  getChildContext() {
    return {
      bemNamespace: this.getBemNamespace(),
      bemBlock: this.getBemBlock(),
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

  cx(options = {}) {
    let opts = {
      namespace: this.getBemNamespace(),
      element: this.constructor.displayName,
      block: this.getBemBlock(),
    };

    Object.assign(opts, options);
    return bemCx(opts);
  },
};

export default BemMixin;
