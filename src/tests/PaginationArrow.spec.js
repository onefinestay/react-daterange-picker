import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import _ from 'underscore';

import PaginationArrow from '../PaginationArrow';

describe('The Pagination Arrow component', function () {

  beforeEach(function () {

    const getPaginationArrow = (props) => {
      props = _.extend({
        disabled: false,
        onTrigger: (() => {}),
        direction: 'next',
        bemBlock: 'DateRangePicker',
      }, props);
      return (<PaginationArrow {...props} />);
    };

    this.useShallowRenderer = (props) => {
      this.shallowRenderer = new ShallowRenderer();
      this.shallowRenderer.render(getPaginationArrow(props));
      this.renderedComponent = this.shallowRenderer.getRenderOutput();
    };

  });

  it('creates the correct markup', function () {
    var clickTrigger = () => {};
    this.useShallowRenderer({
      onTrigger: clickTrigger,
    });
    expect(this.renderedComponent).toEqual(
      <div bemBlock='DateRangePicker' className='DateRangePicker__PaginationArrow DateRangePicker__PaginationArrow--next' onClick={clickTrigger} >
        <div className='DateRangePicker__PaginationArrowIcon DateRangePicker__PaginationArrowIcon--next' />
      </div>
    );
  });
});
