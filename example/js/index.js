import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../index';

const IndexFactory = React.createFactory(Index);

window.React = React;

ReactDOM.render(
  IndexFactory(),
  document.getElementById('app')
);
