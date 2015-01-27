"use strict";
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

module.exports = sortDates;
var _ = _interopRequire(require("underscore"));

function sortDates() {
  return _.sortBy(arguments, function (d) {
    return d.getTime();
  });
}