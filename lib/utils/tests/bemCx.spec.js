'use strict';

var _bemCx = require('../bemCx');

var _bemCx2 = _interopRequireDefault(_bemCx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('bemCx', function () {

  beforeEach(function () {
    this.block = 'block';
    this.element = 'element';
    this.namespace = 'ns';
    this.modifiers = {
      mod1: true,
      mod2: true
    };
    this.states = {
      state1: false,
      state2: true
    };
  });

  it('returns a correct class name if an element and a namespace are provided', function () {
    expect((0, _bemCx2.default)({
      block: this.block,
      element: this.element,
      namespace: this.namespace
    })).toContain('ns-block__element');
  });

  it('returns a correct class name if an element and no namespace are provided', function () {
    expect((0, _bemCx2.default)({
      block: this.block,
      element: this.element
    })).toContain('block__element');
  });

  it('returns a correct class name if no element and a namespace are provided', function () {
    expect((0, _bemCx2.default)({
      block: this.block,
      namespace: this.namespace
    })).toContain('ns-block');
  });

  it('returns a correct class name if no element and no namespace are provided', function () {
    expect((0, _bemCx2.default)({
      block: this.block
    })).toContain('block');
  });

  it('returns the correct class names if states are provided', function () {
    expect((0, _bemCx2.default)({
      block: this.block,
      element: this.element,
      namespace: this.namespace,
      states: this.states
    })).toContain('ns-block__element--is-state2');
  });

  it('returns the correct class names if modifiers are provided', function () {
    expect((0, _bemCx2.default)({
      block: this.block,
      element: this.element,
      namespace: this.namespace,
      modifiers: this.modifiers
    })).toContain('ns-block__element--mod1');
    expect((0, _bemCx2.default)({
      block: this.block,
      element: this.element,
      namespace: this.namespace,
      modifiers: this.modifiers
    })).toContain('ns-block__element--mod2');
  });

  it('returns the correct class names if states and modifiers are provided', function () {
    expect((0, _bemCx2.default)({
      block: this.block,
      element: this.element,
      namespace: this.namespace,
      modifiers: this.modifiers,
      states: this.states
    })).toContain('ns-block__element--mod1--is-state2');
    expect((0, _bemCx2.default)({
      block: this.block,
      element: this.element,
      namespace: this.namespace,
      modifiers: this.modifiers,
      states: this.states
    })).toContain('ns-block__element--mod2--is-state2');
  });
});