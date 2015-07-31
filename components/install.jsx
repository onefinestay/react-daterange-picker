import React from 'react/addons';

import CodeSnippet from './code-snippet';


const Install = React.createClass({
  render() {
    return (
      <div className="install">
        <h2>Install</h2>
        <CodeSnippet language="bash" toggle={false}>
          npm install react-daterange-picker
        </CodeSnippet>
      </div>
    );
  },
});

export default Install;
