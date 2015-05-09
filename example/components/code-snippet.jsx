/* global hljs */
'use strict';

import React from 'react/addons';
import cx from 'classnames';

const CodeSnippet = React.createClass({
  propTypes: {
    language: React.PropTypes.string.isRequired,
    toggle: React.PropTypes.bool,
    visible: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      toggle: true,
      visible: false
    };
  },

  getInitialState: function() {
    return {
      visible: this.props.visible || !this.props.toggle
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

  componentDidMount: function() {
    if (this.state.visible) {
      var el = this.refs.codeBlock.getDOMNode();
      hljs.highlightBlock(el);
    }
  },

  render: function() {
    var arrowClasses = cx({
      'code-snippet__arrow': true,
      'code-snippet__arrow--right': !this.state.visible,
      'code-snippet__arrow--up': this.state.visible,
    });

    return (
      <div className="code-snippet">
        {this.props.toggle ?
          <a href="#" onClick={this.handleClick} className="code-snippet__toggle-button">
            <span className={arrowClasses}></span>
            {!this.state.visible ? "Show code" : "Hide code"}
          </a> : null}
        {this.state.visible ?
          <pre>
            <code className={this.props.language} ref="codeBlock">
              {this.props.children}
            </code>
          </pre> : null}
      </div>
    );
  }
});

export default CodeSnippet;
