/** @jsx React.DOM */
"use strict";

var React = require('react/addons');
var moment = require('moment-range');
var fs = require('fs');
var RangePicker = require('..');

var Header = require('./components/header.jsx');
var Footer = require('./components/footer.jsx');
var GithubRibbon = require('./components/github-ribbon.jsx');
var CodeSnippet = require('./components/code-snippet.jsx');
var Install = require('./components/install.jsx');
var Features = require('./components/features.jsx');


function processCodeSnippet(src) {
  var lines = src.split('\n');
  lines.splice(0, 3);
  return lines.join('\n');
}


var DatePickerRange = React.createClass({
  getInitialState() {
    return {
      value: this.props.value,
      states: null
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
            value={this.state.value ?  this.state.value.start.format('LL') : null}
            readOnly={true}
            placeholder="Start date"/>
          <input type="text"
            value={this.state.value ? this.state.value.end.format('LL') : null}
            readOnly={true}
            placeholder="End date" />
        </div>
      </div>
    );
  }
});


var DatePickerSingle = React.createClass({
  getInitialState() {
    return {
      value: null,
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
            value={this.state.value ?  this.state.value.format('LL') : null}
            readOnly={true} />
        </div>
      </div>
    );
  }
});


var mainCodeSnippet = fs.readFileSync(__dirname + '/code-snippets/main.jsx', 'utf8');


var Index = React.createClass({
  getDefaultProps() {
    return {};
  },

  render() {
    var stateDefinitions = {
      available: {
        color: null,
        label: 'Available'
      },
      enquire: {
        color: '#ffd200',
        label: 'Enquire'
      },
      unavailable: {
        selectable: false,
        color: '#78818b',
        label: 'Unavailable'
      }
    };

    var dateRanges = [
      {
        state: 'enquire',
        range: moment().range(
          moment().add(2, 'weeks').subtract(5, 'days'),
          moment().add(2, 'weeks').add(6, 'days')
        )
      },
      {
        state: 'unavailable',
        range: moment().range(
          moment().add(3, 'weeks'),
          moment().add(3, 'weeks').add(5, 'days')
        )
      }
    ];

    var initialStart = moment().add(1, 'weeks').startOf('day');
    var initialEnd = moment().add(1, 'weeks').add(3, 'days').startOf('day');

    return (
      <html>
        <head>
          <title>React Daterange Picker Demo</title>
          <link href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/styles/docco.min.css' rel='stylesheet' type='text/css'></link>
          <link href="css/react-calendar.css" rel="stylesheet"></link>
          <link href="css/example.css" rel="stylesheet"></link>
          <script src="https://cdn.polyfill.io/v1/polyfill.min.js" />
        </head>
        <body>
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
                value={moment().range(initialStart, initialEnd)}
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
                <h4>Single with no date states</h4>
                <DatePickerSingle
                  numberOfCalendars={2}
                  selectionType="single"
                  minimumDate={new Date()} />
              </div>
            </div>


          </div>

          <Footer />

          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/highlight.min.js" charSet="utf-8"></script>
          <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/languages/javascript.min.js" charSet="utf-8"></script>
          <script src="build/index.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;

