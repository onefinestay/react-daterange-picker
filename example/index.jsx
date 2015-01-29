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
  getInitialState: function() {
    return {
      start: this.props.start,
      end: this.props.end,
    };
  },
  handleSelect: function(range) {
    this.setState({
      start: range.start,
      end: range.end
    });
  },
  render: function() {
    var range;

    if (this.state.start && this.state.end) {
      range = moment().range(this.state.start, this.state.end);
    }

    return (
      <div>
        <RangePicker {...this.props} onSelect={this.handleSelect} value={range} />
        <div>
          <input type="text"
            value={this.state.start ?  this.state.start.format('LL') : null}
            readOnly={true}
            placeholder="Start date"/>
          <input type="text"
            value={this.state.end ? this.state.end.format('LL') : null}
            readOnly={true}
            placeholder="End date" />
        </div>
      </div>
    );
  }
});

var DatePickerSingle = React.createClass({
  getInitialState: function() {
    return {
      value: null,
    };
  },
  handleSelect: function(value) {
    this.setState({
      value: value,
    });
  },
  render: function() {
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
  getDefaultProps: function() {
    return {};
  },

  render: function() {
    var stateDefinitions = {
      available: {
        selectable: true,
        color: '#fff',
        labe: 'Available'
      },
      enquire: {
        selectable: true,
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
          moment().add(2, 'weeks')
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
        </head>
        <body>
          <Header />
          <GithubRibbon />

          <div className="content">
            <div className="example">
              <DatePickerRange
                numberOfCalendars={2}
                selectionType='range'
                earliestDate={new Date()}
                stateDefinitions={stateDefinitions}
                dateStates={dateRanges}
                defaultState="available"
                start={initialStart}
                end={initialEnd} />
              <CodeSnippet language="javascript">
                {processCodeSnippet(mainCodeSnippet)}
              </CodeSnippet>
            </div>

            <Features />
            <Install />


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

            //
            //<div className="examples">
            //  <h2>Examples</h2>
            //
            //  <div className="example">
            //    <h4>Range with no date states</h4>
            //    <DatePickerRange
            //      numberOfCalendars={2}
            //      selectionType="range"
            //      earliestDate={new Date()} />
            //  </div>
            //
            //  <div className="example">
            //    <h4>Single with no date states</h4>
            //    <DatePickerSingle
            //      numberOfCalendars={2}
            //      selectionType="single"
            //      earliestDate={new Date()} />
            //  </div>
            //</div>