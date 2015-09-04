import React from 'react/addons';
import Legend from '../Legend.jsx';


const TestUtils = React.addons.TestUtils;

describe('The Legend component', function () {

  const getLegend = (props) => {
    props = props || {};
    return (<Legend
      selectedLabel={props.selectedLabel || 'test'}
      stateDefinitions={props.stateDefinitions || {}}
    />);
  }

  const useShallowRenderer = (props) => {
    this.shallowRenderer = TestUtils.createRenderer();
    this.shallowRenderer.render(getLegend(props));
    this.renderedComponent = this.shallowRenderer.getRenderOutput();
  };

  const useDocumentRenderer = (props) => {
    this.renderedComponent = TestUtils.renderIntoDocument(getLegend(props));
  };

  beforeEach(() => {
    this.spyCx = spyOn(Legend.prototype.__reactAutoBindMap, 'cx').and.callFake( (data) => {
      data = data || {};
      return data.element || 'my-class';
    });
  });

  it('creates a ul dom element as its root', () => {
    useShallowRenderer();
    expect(this.renderedComponent.type).toBe('ul');
    expect(this.renderedComponent.props.className).toBe('my-class');
  });

  it('creates at least one li, selected by default, using the props.selectedLabel', () => {
    useShallowRenderer();
    expect(this.renderedComponent.props.children.length).toBeGreaterThan(1);
    expect(this.renderedComponent.props.children[0]).toEqual(<li className='LegendItem'>
      <span className='LegendItemColor' />
      <span className='LegendItemLabel'>test</span>
    </li>);
  });

  it('creates extra lis based on the props.stateDefinitions', () => {
    useDocumentRenderer({
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
    var lis = TestUtils.scryRenderedDOMComponentsWithTag(this.renderedComponent, 'li');
    expect(lis.length).toBe(3);
    var spans = TestUtils.scryRenderedDOMComponentsWithTag(lis[1], 'span');
    expect(spans.length).toBe(2);
    expect(spans[0].getDOMNode().style.backgroundColor).toBe('blue');
    expect(spans[1].getDOMNode().textContent).toBe('abc');
  });

});
