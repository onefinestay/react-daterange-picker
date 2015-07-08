'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _utilsBemMixin = require('./utils/BemMixin');

var _utilsBemMixin2 = _interopRequireDefault(_utilsBemMixin);

var PureRenderMixin = _reactAddons2['default'].addons.PureRenderMixin;

var Legend = _reactAddons2['default'].createClass({
  displayName: 'Legend',

  mixins: [_utilsBemMixin2['default'], PureRenderMixin],

  propTypes: {
    selectedLabel: _reactAddons2['default'].PropTypes.string.isRequired,
    stateDefinitions: _reactAddons2['default'].PropTypes.object.isRequired },

  render: function render() {
    var _props = this.props;
    var selectedLabel = _props.selectedLabel;
    var stateDefinitions = _props.stateDefinitions;

    var items = [];
    var name = undefined;
    var def = undefined;
    var style = undefined;

    for (name in stateDefinitions) {
      def = stateDefinitions[name];
      if (def.label && def.color) {
        style = {
          backgroundColor: def.color };
        items.push(_reactAddons2['default'].createElement(
          'li',
          { className: this.cx({ element: 'LegendItem' }), key: name },
          _reactAddons2['default'].createElement('span', { className: this.cx({ element: 'LegendItemColor' }), style: style }),
          _reactAddons2['default'].createElement(
            'span',
            { className: this.cx({ element: 'LegendItemLabel' }) },
            def.label
          )
        ));
      }
    }

    return _reactAddons2['default'].createElement(
      'ul',
      { className: this.cx() },
      _reactAddons2['default'].createElement(
        'li',
        { className: this.cx({ element: 'LegendItem' }) },
        _reactAddons2['default'].createElement('span', { className: this.cx({ element: 'LegendItemColor', modifiers: { 'selection': true } }) }),
        _reactAddons2['default'].createElement(
          'span',
          { className: this.cx({ element: 'LegendItemLabel' }) },
          selectedLabel
        )
      ),
      items
    );
  } });

exports['default'] = Legend;
module.exports = exports['default'];