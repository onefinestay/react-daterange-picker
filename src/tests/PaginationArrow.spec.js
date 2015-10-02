import React from 'react/addons';
import _ from 'underscore';

import PaginationArrow from '../PaginationArrow';

const TestUtils = React.addons.TestUtils;

describe('The Pagination Arrow component', function () {

  beforeEach(function () {

    const getPaginationArrow = (props) => {
      props = _.extend({
        disabled: false,
        onTrigger: (() => {}),
        direction: 'next',
      }, props);
      return (<PaginationArrow {...props} />);
    };

    this.useShallowRenderer = (props) => {
      this.shallowRenderer = TestUtils.createRenderer();
      this.shallowRenderer.render(getPaginationArrow(props));
      this.renderedComponent = this.shallowRenderer.getRenderOutput();
    };

    this.spyCx = spyOn(PaginationArrow.prototype.__reactAutoBindMap, 'cx').and.callFake( (data) => {
      return data.element || 'my-class';
    });
  });

  it('creates the correct markup', function () {
    var clickTrigger = () => {};
    this.useShallowRenderer({
      onTrigger: clickTrigger,
    });
    expect(this.renderedComponent).toEqual(
      <div className='my-class' onClick={clickTrigger}>
        <div className='PaginationArrowIcon' />
      </div>
    );
  });

  it('creates the correct class names', function () {
    this.useShallowRenderer();
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
