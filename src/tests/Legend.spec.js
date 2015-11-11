import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Legend from '../Legend';
import _ from 'underscore';


describe('The Legend component', function () {

  beforeEach(function () {

    const getLegend = (props) => {
      props = _.extend({
        selectedLabel: 'test',
        stateDefinitions: {},
      }, props);

      return (<Legend {...props}/>);
    };

    this.useShallowRenderer = (props) => {
      this.shallowRenderer = TestUtils.createRenderer();
      this.shallowRenderer.render(getLegend(props));
      this.renderedComponent = this.shallowRenderer.getRenderOutput();
    };

    this.useDocumentRenderer = (props) => {
      const domComponent = TestUtils.renderIntoDocument(<div>{getLegend(props)}</div>);
      this.renderedComponent = domComponent.childNodes[0];
    };

    this.spyCx = spyOn(Legend.prototype.__reactAutoBindMap, 'cx').and.callFake( (data) => {
      data = data || {};
      return data.element || 'my-class';
    });
  });

  afterEach( function () {
    if (this.component) {
      React.unmountComponentAtNode(React.findDOMNode(this.component).parentNode);
    }
  });

  it('creates a ul dom element as its root', function () {
    this.useShallowRenderer();
    expect(this.renderedComponent.type).toBe('ul');
    expect(this.renderedComponent.props.className).toBe('my-class');
  });

  it('creates at least one li, selected by default, using the props.selectedLabel', function () {
    this.useShallowRenderer();
    expect(this.renderedComponent.props.children.length).toBeGreaterThan(1);
    expect(this.renderedComponent.props.children[0]).toEqual(<li className='LegendItem'>
      <span className='LegendItemColor' />
      <span className='LegendItemLabel'>test</span>
    </li>);
  });

  it('creates extra lis based on the props.stateDefinitions', function () {
    this.useDocumentRenderer({
      stateDefinitions: {
        a: {
          label: 'abc',
          color: 'blue',
        },
        b: {
          label: 'def',
          color: 'red',
        },
      },
    });

    expect(this.renderedComponent.childNodes.length).toBe(3);

    var spans = this.renderedComponent.childNodes[1].querySelectorAll('span');
    expect(spans.length).toBe(2);

    expect(spans[0].style.backgroundColor).toBe('blue');
    expect(spans[1].textContent).toBe('abc');
  });
});
