"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = areMomentRangesEqual;

function areMomentRangesEqual(r1, r2) {
  return r1.start.isSame(r2.start) && r1.end.isSame(r2.end);
}

module.exports = exports["default"];