/** @jsx React.DOM */
"use strict";

var React = require('react/addons');
var moment = require('moment-range');
var RangePicker = require('../dist/range-picker');

var DatePickerRange = React.createClass({
  getInitialState: function() {
    return {
      start: null,
      end: null,
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
        {this.transferPropsTo(
          RangePicker({
            onSelect: this.handleSelect,
            value: range
          })
        )}
        <div>
          <input type="text"
            value={this.state.start ?  this.state.start.format('LL') : null}
            readOnly={true} />
          <input type="text"
            value={this.state.end ? this.state.end.format('LL') : null}
            readOnly={true} />
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
    return React.DOM.div({},
      this.transferPropsTo(
        RangePicker({
          onSelect: this.handleSelect,
          value: this.state.value
        })
      ),
      React.DOM.div(null,
        React.DOM.input({
          type: 'text',
          value: this.state.value ? this.state.value.format('LL') : null,
          readOnly: true
        }, null)
      )
    );
  }
});

var CODE_EXAMPLE = function() {
var RangePicker = require('react-daterange-picker');

var dateStates = [
  {
    state: 'available',
    range: moment().range(moment(), moment().add(2, 'weeks')),
    selectable: true
  },
  {
    state: 'enquire',
    range: moment().range(moment().add(2, 'weeks'), moment().add(3, 'weeks')),
    selectable: true
  },
  {
    state: 'unavailable',
    range: moment().range(moment().add(3, 'weeks'), moment().add(3, 'weeks').add(5, 'days')),
    selectable: false
  },
  {
    state: 'available',
    range: moment().range(moment().add(3, 'weeks').add(5, 'days'), moment().add(5, 'weeks')),
    selectable: true
  }
];

var DatePicker = React.createClass({
  getInitialState: function() {
    return {
        value: null
    };
  },
  handleSelect: function(range) {
    // range is a moment-range object
    this.setState({
        value: range
    });
  },
  render: function() {
    return RangePicker({
      numberOfCalendars: 2,
      dateStates: dateStates,
      value: this.state.value,
      onSelect: this.handleSelect
    });
  }
});
}.toString();

// remove function declarations
var lines = CODE_EXAMPLE.split('\n');
lines.splice(0, 1);
lines.splice(lines.length - 1, 1);
CODE_EXAMPLE = lines.join('\n');

var Homepage = React.createClass({
  getDefaultProps: function() {
    return {};
  },

  render: function() {
    var dateRanges = [
      {
        range: moment().range(
          moment().startOf('day'),
          moment().add(2, 'weeks')
        ),
        state: 'available',
        selectable: true
      },
      {
        range: moment().range(
          moment().add(2, 'weeks'),
          moment().add(3, 'weeks')
        ),
        state: 'enquire',
        selectable: true
      },
      {
        range: moment().range(
          moment().add(3, 'weeks'),
          moment().add(3, 'weeks').add(5, 'days')
        ),
        state: 'unavailable',
        selectable: false
      },
      {
        range: moment().range(
          moment().add(3, 'weeks').add(5, 'days'),
          moment().add(5, 'weeks')
        ),
        state: 'available',
        selectable: true
      },
    ];

    return (
      <html>
        <head>
          <title>React Range Picker Demo</title>
          <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300' rel='stylesheet' type='text/css'></link>
          <link href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.0/styles/docco.min.css' rel='stylesheet' type='text/css'></link>
          <link href="css/react-calendar.css" rel="stylesheet"></link>
          <link href="css/example.css" rel="stylesheet"></link>
        </head>
        <body>
          <header>
            <h1>React Range Picker</h1>
          </header>

          <div className="content">
            <div id="range-picker" className="example">
              <DatePickerRange
                numberOfCalendars={2}
                selectionType='range'
                earliestDate={new Date()}
                dateStates={dateRanges} />
            </div>
            <div className="code-example">
              <pre id="code-snippet">
                <code className="javascript">
                  {CODE_EXAMPLE}
                </code>
              </pre>
            </div>

            <div className="examples">
              <div className="example">
                <h4>Range with no date states</h4>
                <DatePickerRange
                  numberOfCalendars={2}
                  selectionType="range"
                  earliestDate={new Date()} />
              </div>

              <div className="example">
                <h4>Single with no date states</h4>
                <DatePickerSingle
                  numberOfCalendars={2}
                  selectionType="single"
                  earliestDate={new Date()} />
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

var Footer = React.createClass({
  render: function() {
    return (
      <footer>
        <a href="http://www.onefinestay.com/">onefinestay</a>
        <a href="https://github.com/onefinestay">Github</a>
        <a href="https://twitter.com/buildingOFS">Twitter</a>
      </footer>
    );
  }
});

module.exports = Homepage;
