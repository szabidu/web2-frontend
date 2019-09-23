
'use strict';

class HTMLCustomElement extends HTMLElement {
  constructor(params) {
    const element = super(params);
    element.init();
    return element;
  }

  init() {}

  attributeChangedCallback(name, oldValue, newValue) {
    const transformedName = name.replace(/-([a-z])/g, g => g[1].toUpperCase());
    this[transformedName] = newValue;
  }

  _convertAttributeToBoolean(value) {
    return value !== undefined && value !== null && value !== false && value !== 'false';
  }
}

module.exports = HTMLCustomElement;
