/** @jsx React.DOM */
/* global hljs */
"use strict";

var React = require('react/addons');

var CodeSnippet = React.createClass({
  propTypes: {
    visible: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      visible: this.props.visible
    };
  },

  handleClick: function(event) {
    event.preventDefault();
    var value = !this.state.visible;

    var self = this;

    this.setState({
      visible: value
    }, function() {
      if (value) {
        var el = self.refs.codeBlock.getDOMNode();
        hljs.highlightBlock(el);
      }
    });
  },

  render: function() {
    return (
      <div className="code-snippet">
        <a href="#" onClick={this.handleClick} className="code-snippet__toggle-button">
          {!this.state.visible ? "Show code" : "Hide code"}
        </a>
        {this.state.visible ?
          <pre>
            <code className="javascript" ref="codeBlock">
              {this.props.children}
            </code>
          </pre> : null}
      </div>
    );
  }
});

module.exports = CodeSnippet;
