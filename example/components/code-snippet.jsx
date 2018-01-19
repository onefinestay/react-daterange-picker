/* global hljs */
import React from 'react';

import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import cx from 'classnames';

const CodeSnippet = createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
    language: PropTypes.string.isRequired,
    toggle: PropTypes.bool,
    visible: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      toggle: true,
      visible: false,
    };
  },

  getInitialState() {
    return {
      visible: this.props.visible || !this.props.toggle,
    };
  },

  handleClick(event) {
    event.preventDefault();
    var value = !this.state.visible;

    var self = this;

    this.setState({
      visible: value,
    }, function() {
      if (value) {
        var el = self.refs.codeBlock;
        hljs.highlightBlock(el);
      }
    });
  },

  componentDidMount: function() {
    if (this.state.visible) {
      var el = this.refs.codeBlock;
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
            <span className={arrowClasses} />
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
  },
});

export default CodeSnippet;
