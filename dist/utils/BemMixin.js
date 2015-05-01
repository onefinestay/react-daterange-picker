'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _React = require('react');

var _React2 = _interopRequireDefault(_React);

var _bemCx = require('./bemCx');

var _bemCx2 = _interopRequireDefault(_bemCx);

var BemMixin = {
  propTypes: {
    bemNamespace: _React2['default'].PropTypes.string,
    bemBlock: _React2['default'].PropTypes.string
  },

  contextTypes: {
    bemNamespace: _React2['default'].PropTypes.string,
    bemBlock: _React2['default'].PropTypes.string
  },

  childContextTypes: {
    bemNamespace: _React2['default'].PropTypes.string,
    bemBlock: _React2['default'].PropTypes.string
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

  cx: function cx() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    var opts = {
      namespace: this.getBemNamespace(),
      element: this.constructor.displayName,
      block: this.getBemBlock() };

    Object.assign(opts, options);
    return _bemCx2['default'](opts);
  }
};

exports['default'] = BemMixin;
module.exports = exports['default'];