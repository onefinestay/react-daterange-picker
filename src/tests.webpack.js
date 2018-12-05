import 'babel-polyfill';
var context = require.context('../src', true, /\.spec\.js$/);
context.keys().forEach(context);
