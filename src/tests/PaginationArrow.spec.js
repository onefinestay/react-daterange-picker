import React from 'react/addons';

import PaginationArrow from '../PaginationArrow.jsx';

const TestUtils = React.addons.TestUtils;

describe('The Pagination Arrow component', function () {

  const getPaginationArrow = (props) => {
    props = props || {};
    return (<PaginationArrow
      disabled={props.disabled || false}
      onTrigger={props.onTrigger || (() => {})}
      direction={props.direction || 'next'}
    />);
  };

  const useShallowRenderer = (props) => {
    this.shallowRenderer = TestUtils.createRenderer();
    this.shallowRenderer.render(getPaginationArrow(props));
    this.renderedComponent = this.shallowRenderer.getRenderOutput();
  };

  const useDocumentRenderer = (props) => {
    this.renderedComponent = TestUtils.renderIntoDocument(getPaginationArrow(props));
  };

  beforeEach(() => {
    this.spyCx = spyOn(PaginationArrow.prototype.__reactAutoBindMap, 'cx').and.callFake( (data) => {
      return data.element || 'my-class';
    });
  });

  it('creates the correct markup', () => {
    var clickTrigger = () => {};
    useShallowRenderer({
      onTrigger: clickTrigger,
    });
    expect(this.renderedComponent).toEqual(
      <div className='my-class' onClick={clickTrigger}>
        <div className='PaginationArrowIcon' />
      </div>
    );
  });

  it('creates the correct class names', () => {
    useShallowRenderer();
    expect(this.spyCx).toHaveBeenCalledWith({
      modifiers: {
        'next': true,
      },
      states: {
        disabled: false,
      },
    });
    expect(this.spyCx).toHaveBeenCalledWith({
      element: 'PaginationArrowIcon',
      modifiers: {
        'next': true,
      },
      states: {
        disabled: false,
      },
    });
  });

});
