'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shallowEqual = require('../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PureRenderMixin = {
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return !(0, _shallowEqual2.default)(this.props, nextProps) || !(0, _shallowEqual2.default)(this.state, nextState);
  }
};

exports.default = PureRenderMixin;