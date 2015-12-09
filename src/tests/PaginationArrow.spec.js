import React from 'react';
import TestUtils from 'react-addons-test-utils';
import _ from 'underscore';

import PaginationArrow from '../PaginationArrow';

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

  });

  it('creates the correct markup', function () {
    var clickTrigger = () => {};
    this.useShallowRenderer({
      onTrigger: clickTrigger,
    });
    expect(this.renderedComponent).toEqual(
      <div className='null__PaginationArrow null__PaginationArrow--next' onClick={clickTrigger}>
        <div className='null__PaginationArrowIcon null__PaginationArrowIcon--next' />
      </div>
    );
  });

});
