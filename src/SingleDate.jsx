'use strict';

import React from 'react/addons';
import moment from 'moment';
import _ from 'underscore';

var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var SingleDate = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    date: React.PropTypes.instanceOf(Date).isRequired,

    firstOfMonth: React.PropTypes.instanceOf(Date).isRequired,
    index: React.PropTypes.number.isRequired,
    maxIndex: React.PropTypes.number.isRequired,
    selectionType: React.PropTypes.string.isRequired,

    value: React.PropTypes.object,
    minDate: React.PropTypes.instanceOf(Date),
    maxDate: React.PropTypes.instanceOf(Date),
    highlightedRange: React.PropTypes.object,
    highlightedDate: React.PropTypes.instanceOf(Date),
    selectedStartDate: React.PropTypes.instanceOf(Date),

    onHighlightDate: React.PropTypes.func,
    onUnHighlightDate: React.PropTypes.func,
    onStartSelection: React.PropTypes.func,
    onCompleteSelection: React.PropTypes.func
  },

  isDisabled(date) {
    var y = this.props.firstOfMonth.getFullYear();
    var m = this.props.firstOfMonth.getMonth();

    if (date.getMonth() !== m) {
      if (this.props.index < this.props.maxIndex && date.getTime() >= new Date(y, m + 1, 1).getTime()) {
        return true;
      }
      if (this.props.index > 0 && date.getTime() <= new Date(y, m, 1).getTime()) {
        return true;
      }
    }

    if (this.props.minDate && date.getTime() < this.props.minDate.getTime()) {
      return true;
    }
    if (this.props.maxDate && date.getTime() > this.props.maxDate.getTime()) {
      return true;
    }
    return false;
  },

  highlightDate(date) {
    if (!this.isDisabled(date)) {
      this.props.onHighlightDate(date);
    }
  },

  unHighlightDate(date) {
    this.props.onUnHighlightDate(date);
  },

  selectDate(date) {
    if (!this.isDisabled(date)) {
      this.props.onSelect(date);
    }
  },

  getClasses() {
    var date = this.props.date;
    var isOtherMonth = false;
    var isSelected = false;
    var isHighlighted = false;

    var isDisabled = this.isDisabled(date);

    var time = date.getTime();

    if (date.getMonth() !== this.props.firstOfMonth.getMonth()) {
      isOtherMonth = true;
    }

    if (!isDisabled) {
      // Selections
      if (this.props.value && (time === this.props.value.toDate().getTime())) {
        isSelected = true;
      }

      // Highlights (Hover states)
      if (this.props.highlightedDate && this.props.highlightedDate.getTime() === time) {
        isHighlighted = true;
      }
    }

    return {
      'reactDaterangePicker__date': true,
      'reactDaterangePicker__date--is-selected': isSelected,
      'reactDaterangePicker__date--is-highlighted': isHighlighted,
      'reactDaterangePicker__date--is-disabled': isDisabled,
      'reactDaterangePicker__date--is-inOtherMonth': isOtherMonth
    };
  },

  render: function() {
    var classes = this.getClasses();

    return (
      <td className={cx(classes)} onMouseEnter={this.highlightDate.bind(this, this.props.date)} onMouseLeave={this.unHighlightDate.bind(this, this.props.date)} onClick={this.selectDate.bind(this, this.props.date)}>
        <span className="reactDaterangePicker__dateLabel">{this.props.date.getDate()}</span>
      </td>
    );
  }
});

export default SingleDate;
