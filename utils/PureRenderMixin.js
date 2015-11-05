import shallowEqual from '../utils/shallowEqual';


const PureRenderMixin = {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  },
};

export default PureRenderMixin;
