/* eslint-disable react/no-multi-comp */

import React from 'react';
import moment from 'moment';
import {} from 'moment-range';
var fs = require('fs');
import timekeeper from 'timekeeper';
import RangePicker from '../src';

import Header from './components/header';
import Footer from './components/footer';
import GithubRibbon from './components/github-ribbon';
import CodeSnippet from './components/code-snippet';
import Install from './components/install';
import Features from './components/features';


// freeze date to April 1st
timekeeper.freeze(new Date('2015-04-01'));

function processCodeSnippet(src) {
  var lines = src.split('\n');
  lines.splice(0, 3);
  return lines.join('\n');
}


const DatePickerRange = React.createClass({
  propTypes: {
    value: React.PropTypes.object,
  },

  getInitialState() {
    return {
      value: this.props.value,
      states: null,
    };
  },

  handleSelect(value, states) {
    this.setState({value, states});
  },

  render() {
    return (
      <div>
        <RangePicker {...this.props} onSelect={this.handleSelect} value={this.state.value} />
        <div>
          <input type="text"
            value={this.state.value ? this.state.value.start.format('LL') : ""}
            readOnly={true}
            placeholder="Start date"/>
          <input type="text"
            value={this.state.value ? this.state.value.end.format('LL') : ""}
            readOnly={true}
            placeholder="End date" />
        </div>
      </div>
    );
  },
});


const DatePickerSingle = React.createClass({
  getInitialState() {
    return {
      value: "",
    };
  },

  handleSelect(value) {
    this.setState({
      value: value,
    });
  },

  render() {
    return (
      <div>
        <RangePicker {...this.props} onSelect={this.handleSelect}
          value={this.state.value} />
        <div>
          <input type="text"
            value={this.state.value ? this.state.value.format('LL') : ""}
            readOnly={true} />
        </div>
      </div>
    );
  },
});


var mainCodeSnippet = fs.readFileSync(__dirname + '/code-snippets/main.jsx', 'utf8');


const Index = React.createClass({
  getDefaultProps() {
    return {};
  },

  render() {
    const stateDefinitions = {
      available: {
        color: '#ffffff',
        label: 'Available',
      },
      enquire: {
        color: '#ffd200',
        label: 'Enquire',
      },
      unavailable: {
        selectable: false,
        color: '#78818b',
        label: 'Unavailable',
      },
    };

    const dateRanges = [
      {
        state: 'enquire',
        range: moment.range(
          moment().add(2, 'weeks').subtract(5, 'days'),
          moment().add(2, 'weeks').add(6, 'days')
        ),
      },
      {
        state: 'unavailable',
        range: moment.range(
          moment().add(3, 'weeks'),
          moment().add(3, 'weeks').add(5, 'days')
        ),
      },
    ];

    const initialStart = moment().add(1, 'weeks').startOf('day');
    const initialEnd = moment().add(1, 'weeks').add(3, 'days').startOf('day');

    return (
      <main>
        <Header />
        <GithubRibbon />

        <div className="content">
          <div className="example">
            <DatePickerRange
              firstOfWeek={1}
              numberOfCalendars={2}
              selectionType='range'
              minimumDate={new Date()}
              maximumDate={moment().add(2, 'years').toDate()}
              stateDefinitions={stateDefinitions}
              dateStates={dateRanges}
              defaultState="available"
              value={moment.range(initialStart, initialEnd)}
              showLegend={true}
              />
            <CodeSnippet language="javascript">
              {processCodeSnippet(mainCodeSnippet)}
            </CodeSnippet>
          </div>

          <Features />
          <Install />

          <div className="examples">
            <h2>Examples</h2>

            <div className="example">
              <h4>Range with no date states</h4>
              <DatePickerRange
                numberOfCalendars={2}
                selectionType="range"
                minimumDate={new Date()} />
            </div>

            <div className="example">
              <h4>Range with day-long ranges allowed</h4>
              <DatePickerRange
                numberOfCalendars={2}
                selectionType="range"
                singleDateRange={true}
                minimumDate={new Date()} />
            </div>

            <div className="example">
              <h4>Single with no date states</h4>
              <DatePickerSingle
                numberOfCalendars={2}
                selectionType="single"
                minimumDate={new Date()} />
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  },
});

export default Index;
