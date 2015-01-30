"use strict";
var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var React = _interopRequire(require("react/addons"));

var PureRenderMixin = React.addons.PureRenderMixin;
var cx = React.addons.classSet;


var Legend = React.createClass({
  displayName: "Legend",
  mixins: [PureRenderMixin],

  render: function render() {
    var items = [];
    var name;
    var def;
    var style;

    for (name in this.props.stateDefinitions) {
      def = this.props.stateDefinitions[name];
      if (def.label && def.color) {
        style = {
          backgroundColor: def.color
        };
        items.push(React.createElement(
          "li",
          { className: "reactDaterangePicker__legendItem" },
          React.createElement("span", { className: "reactDaterangePicker__legendItemColor", style: style }),
          React.createElement(
            "span",
            { className: "reactDaterangePicker__legendItemLabel" },
            def.label
          )
        ));
      }
    }

    return React.createElement(
      "ul",
      { className: "reactDaterangePicker__legend" },
      React.createElement(
        "li",
        { className: "reactDaterangePicker__legendItem reactDaterangePicker__legendItem" },
        React.createElement("span", { className: "reactDaterangePicker__legendItemColor reactDaterangePicker__legendItemColor--selection" }),
        React.createElement(
          "span",
          { className: "reactDaterangePicker__legendItemLabel" },
          "Your selected dates"
        )
      ),
      items
    );
  }
});

module.exports = Legend;