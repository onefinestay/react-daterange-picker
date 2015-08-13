import React from 'react/addons';
import CalendarHighlight from '../CalendarHighlight.jsx';

import BemMixin from '../../utils/BemMixin';


const TestUtils = React.addons.TestUtils;

describe('The CalendarHighlight Component', function () {
    beforeEach(() => {
        this.spyCx = spyOn(CalendarHighlight.prototype.__reactAutoBindMap, 'cx').and.returnValue('my-class');

        var shallowRenderer = TestUtils.createRenderer();
        shallowRenderer.render(<CalendarHighlight pending={true} modifier='test'/>);
        this.renderedComponent = shallowRenderer.getRenderOutput();
    });

    it('should render the right element', () => {
        expect(this.renderedComponent.type).toBe('div');
        expect(this.spyCx).toHaveBeenCalledWith({
            states: {
            },
            modifiers: {
                test: true
            },
        });
        expect(this.renderedComponent.props.className).toEqual('my-class');
    });
});