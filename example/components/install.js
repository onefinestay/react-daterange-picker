import React from 'react';

import CodeSnippet from './code-snippet';


const Install = React.createClass({
  render() {
    return (
      <div className="install">
        <h2>Install</h2>
        <CodeSnippet language="bash" toggle={false}>
          npm install nuvi-daterange-picker
        </CodeSnippet>
      </div>
    );
  },
});

export default Install;
