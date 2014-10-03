"use strict";

var _ = require('underscore');

module.exports = {
  sortDates: function() {
    return _.sortBy(arguments, function(d) { return d.getTime(); });
  }
};
