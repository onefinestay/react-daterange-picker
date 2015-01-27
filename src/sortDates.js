'use strict';
import _ from 'underscore';

export default function sortDates() {
  return _.sortBy(arguments, function(d) { return d.getTime(); });
}