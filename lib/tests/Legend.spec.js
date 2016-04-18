'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _Legend = require('../Legend');

var _Legend2 = _interopRequireDefault(_Legend);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('The Legend component', function () {

  beforeEach(function () {
    var _this = this;

    var getLegend = function getLegend(props) {
      props = _lodash2.default.extend({
        selectedLabel: 'test',
        stateDefinitions: {},
        bemBlock: 'DateRangePicker'
      }, props);

      return _react2.default.createElement(_Legend2.default, props);
    };

    this.useShallowRenderer = function (props) {
      _this.shallowRenderer = _reactAddonsTestUtils2.default.createRenderer();
      _this.shallowRenderer.render(getLegend(props));
      _this.renderedComponent = _this.shallowRenderer.getRenderOutput();
    };

    this.useDocumentRenderer = function (props) {
      var domComponent = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        'div',
        null,
        getLegend(props)
      ));
      _this.renderedComponent = domComponent.childNodes[0];
    };
  });

  afterEach(function () {
    if (this.component) {
      _reactDom2.default.unmountComponentAtNode(_reactDom2.default.findDOMNode(this.component).parentNode);
    }
  });

  it('creates a ul dom element as its root', function () {
    this.useShallowRenderer();
    expect(this.renderedComponent.type).toBe('ul');
    expect(this.renderedComponent.props.className).toBe('DateRangePicker__Legend');
  });

  it('creates at least one li, selected by default, using the props.selectedLabel', function () {
    this.useShallowRenderer();
    expect(this.renderedComponent.props.children.length).toBeGreaterThan(1);
    expect(this.renderedComponent.props.children[0]).toEqual(_react2.default.createElement(
      'li',
      { className: 'DateRangePicker__LegendItem' },
      _react2.default.createElement('span', { className: 'DateRangePicker__LegendItemColor DateRangePicker__LegendItemColor--selection' }),
      _react2.default.createElement(
        'span',
        { className: 'DateRangePicker__LegendItemLabel' },
        'test'
      )
    ));
  });

  it('creates extra lis based on the props.stateDefinitions', function () {
    this.useDocumentRenderer({
      stateDefinitions: {
        a: {
          label: 'abc',
          color: 'blue'
        },
        b: {
          label: 'def',
          color: 'red'
        }
      }
    });

    expect(this.renderedComponent.childNodes.length).toBe(3);

    var spans = this.renderedComponent.childNodes[1].querySelectorAll('span');
    expect(spans.length).toBe(2);

    expect(spans[0].style.backgroundColor).toBe('blue');
    expect(spans[1].textContent).toBe('abc');
  });
});