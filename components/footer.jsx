/** @jsx React.DOM */
"use strict";

var React = require('react/addons');

var Footer = React.createClass({
  render: function() {
    return (
      <footer className="footer">
        <OFSCredit />
        <div className="footer__links">
          <a href="http://tech.onefinestay.com/" className="footer__link">Blog</a>
          <a href="https://github.com/onefinestay" className="footer__link">Github</a>
          <a href="https://twitter.com/buildingOFS" className="footer__link">Twitter</a>
        </div>
      </footer>
    );
  }
});

var OFSCredit = React.createClass({
  render: function() {
    return (
      <div className="ofs-credit">
        <p className="ofs-credit__text">Built by</p>
        <a href="http://www.onefinestay.com/" className="ofs-credit__logo">
          <img src="img/logo.png"/>
        </a>
      </div>
    );
  }
});

module.exports = Footer;
