'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsShallowEqual = require('../utils/shallowEqual');

var _utilsShallowEqual2 = _interopRequireDefault(_utilsShallowEqual);

var PureRenderMixin = {
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return !(0, _utilsShallowEqual2['default'])(this.props, nextProps) || !(0, _utilsShallowEqual2['default'])(this.state, nextState);
  }
};

exports['default'] = PureRenderMixin;
module.exports = exports['default'];