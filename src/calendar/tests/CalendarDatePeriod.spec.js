import React from 'react/addons';
import CalendarSelection from '../CalendarSelection.jsx';

import BemMixin from '../../utils/BemMixin';


const TestUtils = React.addons.TestUtils;

describe('The CalendarSelection Component', function () {
    beforeEach(() => {
        this.spy = spyOn(CalendarSelection.prototype.__reactAutoBindMap, 'cx').and.returnValue('my-class');

        var shallowRenderer = TestUtils.createRenderer();
        shallowRenderer.render(<CalendarSelection pending={true} modifier='test'/>);
        this.renderedComponent = shallowRenderer.getRenderOutput();
    });

    it('should render the right element', () => {
        expect(this.renderedComponent.type).toBe('div');
        expect(this.spy).toHaveBeenCalledWith({
            states: {
                pending: true
            },
            modifiers: {
                test: true
            }
        })
        expect(this.renderedComponent.props.className).toEqual('my-class');
    });
});