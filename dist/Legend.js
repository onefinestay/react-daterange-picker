'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BemMixin = require('./utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Legend = _react2.default.createClass({
  displayName: 'Legend',

  mixins: [_BemMixin2.default, _reactAddonsPureRenderMixin2.default],

  propTypes: {
    selectedLabel: _react2.default.PropTypes.string.isRequired,
    stateDefinitions: _react2.default.PropTypes.object.isRequired
  },

  render: function render() {
    var _props = this.props,
        selectedLabel = _props.selectedLabel,
        stateDefinitions = _props.stateDefinitions;

    var items = [];
    var name = void 0;
    var def = void 0;
    var style = void 0;

    for (name in stateDefinitions) {
      def = stateDefinitions[name];
      if (def.label && def.color) {
        style = {
          backgroundColor: def.color
        };
        items.push(_react2.default.createElement(
          'li',
          { className: this.cx({ element: 'LegendItem' }), key: name },
          _react2.default.createElement('span', { className: this.cx({ element: 'LegendItemColor' }), style: style }),
          _react2.default.createElement(
            'span',
            { className: this.cx({ element: 'LegendItemLabel' }) },
            def.label
          )
        ));
      }
    }

    return _react2.default.createElement(
      'ul',
      { className: this.cx() },
      _react2.default.createElement(
        'li',
        { className: this.cx({ element: 'LegendItem' }) },
        _react2.default.createElement('span', { className: this.cx({ element: 'LegendItemColor', modifiers: { 'selection': true } }) }),
        _react2.default.createElement(
          'span',
          { className: this.cx({ element: 'LegendItemLabel' }) },
          selectedLabel
        )
      ),
      items
    );
  }
});

exports.default = Legend;