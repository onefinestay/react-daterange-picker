/* eslint-disable react/no-multi-comp */

import React from 'react';

import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import moment from './moment-range';
var fs = require('fs');
import timekeeper from 'timekeeper';
import RangePicker from '../src';

import Header from './components/header';
import Footer from './components/footer';
import GithubRibbon from './components/github-ribbon';
import CodeSnippet from './components/code-snippet';
import Install from './components/install';
import Features from './components/features';
import QuickSelection from './components/quick-selection';

const today = moment();
// freeze date to April 1st
timekeeper.freeze(new Date('2016-04-01'));

function processCodeSnippet(src) {
  var lines = src.split('\n');
  lines.splice(0, 3);
  return lines.join('\n');
}

const DatePickerRange = createClass({
  propTypes: {
    value: PropTypes.object,
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


const DatePickerSingle = createClass({
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

const DatePickerSingleWithSetDateButtons = createClass({
  getInitialState() {
    return {
      value: null,
    };
  },

  handleSelect(value) {
    this.setState({ value });
  },

  setDate(value) {
    this.setState({ value });
  },

  render() {
    const dateRanges = {
      'Today': today,
      'Next Month': today.clone().add(1, 'month'),
      'Last Month': today.clone().subtract(1, 'month'),

      'Next Year': today.clone().add(1, 'year'),
      'Last Year': today.clone().subtract(1, 'year'),
    };

    return (
      <div className="singleDateRange">
        <RangePicker {...this.props} onSelect={this.handleSelect} value={this.state.value} />
        <QuickSelection dates={dateRanges} value={this.state.value} onSelect={this.setDate} />
        <div>
          <input type="text"
            value={this.state.value ? this.state.value.format('LL') : ''}
            readOnly={true} />
        </div>
      </div>
    );
  },
});

const DatePickerRangeWithSetRangeButtons = createClass({
  getInitialState() {
    return {
      value: null,
      states: null,
    };
  },

  handleSelect(value, states) {
    this.setState({ value, states });
  },

  setRange(value){
    this.setState({ value });
  },

  render() {
    const dateRanges = {
      'Last 7 days': moment.range(
        today.clone().subtract(7, 'days'),
        today.clone()
      ),
      'This Year': moment.range(
        today.clone().startOf('year'),
        today.clone()
      ),
    };

    return (
      <div className="rangeDateContainer">
        <QuickSelection dates={dateRanges} value={this.state.value} onSelect={this.setRange} />
        <RangePicker {...this.props} onSelect={this.handleSelect} value={this.state.value} />
        <div>
          <input type="text"
            value={this.state.value ? this.state.value.start.format('LL') : ''}
            readOnly={true}
            placeholder="Start date"/>
          <input type="text"
            value={this.state.value ? this.state.value.end.format('LL') : ''}
            readOnly={true}
            placeholder="End date" />
        </div>
      </div>
    );
  },
});

var mainCodeSnippet = fs.readFileSync(__dirname + '/code-snippets/main.jsx', 'utf8');
var i18nCodeSnippet = fs.readFileSync(__dirname + '/code-snippets/i18n.jsx', 'utf8');

const Index = createClass({
  getInitialState() {
    return {
      locale: 'en',
    };
  },

  getDefaultProps() {
    return {};
  },

  _selectLocale() {
    const locale = this.refs.locale.value;
    if (locale !== 'en') {
      require(`moment/locale/${locale}`);
    }
    moment.locale(locale);

    this.setState({
      locale: locale,
    });
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

            <div className="example">
              <h4>
                i18n support based on moment/locale &nbsp;&nbsp;
                <select ref="locale" onChange={this._selectLocale} name="locale" id="locale">
                  <option value="en">EN</option>
                  <option value="ar-sa">AR</option>
                  <option value="fr">FR</option>
                  <option value="it">IT</option>
                  <option value="es">ES</option>
                  <option value="de">DE</option>
                  <option value="ru">RU</option>
                </select>
              </h4>
              <DatePickerRange
                locale={this.state.locale}
                numberOfCalendars={2}
                selectionType="range"
                minimumDate={new Date()} />
              <CodeSnippet language="javascript">
                {processCodeSnippet(i18nCodeSnippet)}
              </CodeSnippet>
            </div>

            <div className="example">
              <h4>Setting Calendar Externally</h4>
              <DatePickerSingleWithSetDateButtons
                numberOfCalendars={1}
                selectionType="single"
                />
            </div>

            <div className="example">
              <h4>Setting Calendar Range Externally</h4>
              <DatePickerRangeWithSetRangeButtons
                numberOfCalendars={2}
                selectionType="range"
                />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  },
});

export default Index;
