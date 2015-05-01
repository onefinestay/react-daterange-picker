'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _React = require('react/addons');

var _React2 = _interopRequireDefault(_React);

var _bemCx = require('./utils/bemCx');

var _bemCx2 = _interopRequireDefault(_bemCx);

var _BemMixin = require('./utils/BemMixin');

var _BemMixin2 = _interopRequireDefault(_BemMixin);

'use strict';

var PureRenderMixin = _React2['default'].addons.PureRenderMixin;
var cx = _React2['default'].addons.classSet;

var Legend = _React2['default'].createClass({
  displayName: 'Legend',

  mixins: [_BemMixin2['default'], PureRenderMixin],

  render: function render() {
    var _props = this.props;
    var selectedLabel = _props.selectedLabel;
    var stateDefinitions = _props.stateDefinitions;

    var block = this.getBemBlock();
    var namespace = this.getBemNamespace();
    var items = [];
    var name;
    var def;
    var style;

    for (name in stateDefinitions) {
      def = stateDefinitions[name];
      if (def.label && def.color) {
        style = {
          backgroundColor: def.color
        };
        items.push(_React2['default'].createElement(
          'li',
          { className: this.cx({ element: 'LegendItem' }), key: name },
          _React2['default'].createElement('span', { className: this.cx({ element: 'LegendItemColor' }), style: style }),
          _React2['default'].createElement(
            'span',
            { className: this.cx({ element: 'LegendItemLabel' }) },
            def.label
          )
        ));
      }
    }

    return _React2['default'].createElement(
      'ul',
      { className: this.cx() },
      _React2['default'].createElement(
        'li',
        { className: this.cx({ element: 'LegendItem' }) },
        _React2['default'].createElement('span', { className: this.cx({ element: 'LegendItemColor', modifiers: { selection: true } }) }),
        _React2['default'].createElement(
          'span',
          { className: this.cx({ element: 'LegendItemLabel' }) },
          selectedLabel
        )
      ),
      items
    );
  }
});

exports['default'] = Legend;
module.exports = exports['default'];