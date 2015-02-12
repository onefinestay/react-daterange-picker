"use strict";
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var bemCx = _interopRequire(require("./utils/bemCx"));

var BemMixin = _interopRequire(require("./utils/BemMixin"));

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var Legend = React.createClass({
  displayName: "Legend",
  mixins: [BemMixin, PureRenderMixin],

  render: function render() {
    var stateDefinitions = this.props.stateDefinitions;
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
        items.push(React.createElement(
          "li",
          { className: this.cx({ element: "LegendItem" }), key: name },
          React.createElement("span", { className: this.cx({ element: "LegendItemColor" }), style: style }),
          React.createElement(
            "span",
            { className: this.cx({ element: "LegendItemLabel" }) },
            def.label
          )
        ));
      }
    }

    return React.createElement(
      "ul",
      { className: this.cx() },
      React.createElement(
        "li",
        { className: this.cx({ element: "LegendItem" }) },
        React.createElement("span", { className: this.cx({ element: "LegendItemColor", modifiers: { selection: true } }) }),
        React.createElement(
          "span",
          { className: this.cx({ element: "LegendItemLabel" }) },
          "Your selected dates"
        )
      ),
      items
    );
  }
});

module.exports = Legend;