"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react"));

var bemCx = _interopRequire(require("./bemCx"));




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

  getChildContext: function getChildContext() {
    return {
      bemNamespace: this.getBemNamespace(),
      bemBlock: this.getBemBlock()
    };
  },

  getBemNamespace: function getBemNamespace() {
    if (this.props.bemNamespace) {
      return this.props.bemNamespace;
    }
    if (this.context.bemNamespace) {
      return this.context.bemNamespace;
    }
    return null;
  },

  getBemBlock: function getBemBlock() {
    if (this.props.bemBlock) {
      return this.props.bemBlock;
    }
    if (this.context.bemBlock) {
      return this.context.bemBlock;
    }
    return null;
  },

  cx: function cx(options) {
    var opts = {
      namespace: this.getBemNamespace(),
      block: this.getBemBlock() };

    Object.assign(opts, options);
    return bemCx(opts);
  }
};

module.exports = BemMixin;