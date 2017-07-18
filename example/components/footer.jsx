/* eslint-disable react/no-multi-comp */

import React from 'react';
import createClass from 'create-react-class';


const OFSCredit = createClass({
  render() {
    return (
      <div className="ofs-credit">
        <p className="ofs-credit__text">Built by</p>
        <a href="http://www.onefinestay.com/" className="ofs-credit__logo">
          <img src="img/logo.png"/>
        </a>
      </div>
    );
  },
});


const Footer = createClass({
  render() {
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
  },
});


export default Footer;
