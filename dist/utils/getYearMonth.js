'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getYearMonthProps = undefined;
exports.getYearMonth = getYearMonth;

var _momentRange = require('../moment-range');

var _momentRange2 = _interopRequireDefault(_momentRange);

var _isMomentRange = require('./isMomentRange');

var _isMomentRange2 = _interopRequireDefault(_isMomentRange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getYearMonth(date) {
  if (!_momentRange2.default.isMoment(date)) {
    return undefined;
  }

  return { year: date.year(), month: date.month() };
}

var getYearMonthProps = exports.getYearMonthProps = function getYearMonthProps(props) {
  var selectionType = props.selectionType,
      value = props.value,
      initialYear = props.initialYear,
      initialMonth = props.initialMonth;

  if (!(_momentRange2.default.isMoment(value) || (0, _isMomentRange2.default)(value))) {
    return { year: initialYear, month: initialMonth };
  }

  if (selectionType === 'single') {
    return getYearMonth(value);
  }

  return getYearMonth(value.start);
};