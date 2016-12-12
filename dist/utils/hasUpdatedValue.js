'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (previousProps, nextProps) {
  var previousValue = previousProps.value;
  var nextValue = nextProps.value;

  return !(previousValue === nextValue || (0, _areMomentValuesEqual2.default)(previousValue, nextValue) || (0, _areMomentRangesEqual2.default)(previousValue, nextValue));
};

var _areMomentRangesEqual = require('./areMomentRangesEqual');

var _areMomentRangesEqual2 = _interopRequireDefault(_areMomentRangesEqual);

var _areMomentValuesEqual = require('./areMomentValuesEqual');

var _areMomentValuesEqual2 = _interopRequireDefault(_areMomentValuesEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }