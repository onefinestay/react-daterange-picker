React Daterange Picker
======================

A React based date range picker.

[Demo](http://onefinestay.github.io/react-daterange-picker/)

## Getting Started

There's lots of examples within the [demo page](http://onefinestay.github.io/react-daterange-picker/), or check out a minimal example within code CodeSandbox:

[![Edit 0xv5m04yql](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/0xv5m04yql?initialpath=%2Fsrc%2FDateRangeExample.js)

## Features

* Select a date range in an intuitive way.
* Define date ranges that are not available for selection.
* Show any number of months at the same time.
* Visually represent half day states.

## React Version

React 0.14, 15, and 16 are all supported in the latest version of react-daterange-picker.

If you wish to user an older version of React, please use react-daterange-picker v0.12.x or below.

## Change Log

All change log information is available within the project's [releases](https://github.com/onefinestay/react-daterange-picker/releases).

## Contribute

Please feel to contribute to this project by making pull requests. You can see a
list of tasks that can be worked on in the [issues list](https://github.com/onefinestay/react-daterange-picker/issues).

Before a pull request can be merged, ensure that you have linted your files and all tests are passing -

```shell
npm run lint
npm run test
```

### Publishing

If you have been added as a project contributor and wish to publish a new release -

  - Ensure that you have added yourself to the `package.json` contributors list
  - Bump the npm version as appropriate, following [SemVer](http://semver.org/) conventions
  - Update the [Demo](http://onefinestay.github.io/react-daterange-picker/) by running `npm run deploy-example`

### Building example page

Once you have the repository cloned run the following commands to get started:

```shell
npm install
npm run develop
```

This will start a local server at `http://localhost:9989` where you can see the
example page. It will also watch for any files changes and rebuild.
To update the compiled files in dist run `npm run build-dist-js`, and you can
lint the code with `npm run lint`.
