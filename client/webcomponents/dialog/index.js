'use strict';

const HTMLCustomElement = require('../custom-element');
const hyperHTML = require('hyperhtml/umd');
const template = require('./template');
const cookie = {
  get: (name) => {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  },

  set: (name, value, days) => {
    const d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
  }
}

class TilosDialog extends HTMLCustomElement {
  init() {
    this._dom = {};
    this._state = {};
    this._events = {};
    this._dom.wrapper = document.createElement('div');
    this._state.header = "Tilos Rádió";
    this._state.content = null;
    this._state.open = false;
    this._state.checkbox = null;
    this._state.defaultOpen = false;
    this._state.forceOpen = false;
    this._id = null;
    this._state.firstOpen = true;
    this._renderer = hyperHTML.bind(this._dom.wrapper);
    this._events.close = this.close.bind(this);
  }

  connectedCallback() {
    this._id = this.getAttribute('id');
    document.body.appendChild(this._dom.wrapper);
    this._render();
  }

  static get observedAttributes() {
    return ['header', 'default-open'];
  }

  set header(value) {
    if(value === this._state.header) return;

    this._state.header = value;
    this._render();
  }

  set defaultOpen(value) {
    const converted = super._convertAttributeToBoolean(value);
    if(converted === this._state.defaultOpen) return;
    this._state.defaultOpen = converted;
    this._render();
  }

  open() {
    this._state.open = true;
    this._render();
  }

  close() {
    this._state.firstOpen = false;
    this._state.open = false;
    if(this._id) {
      cookie.set(this._id, !this._state.checkbox.checked, 60);
    }
    this._render();
  }

  _getForceOpenValue() {
    if (!this._state.firstOpen || !this._state.defaultOpen) return false;

    const dataFromCookie = cookie.get(this._id);
    return dataFromCookie === null ? this._state.defaultOpen : dataFromCookie === 'true';
  }

  _render() {
    if (!this.parentNode && !this._id) return;
    this._state.forceOpen = this._getForceOpenValue();
    const newContent = this.querySelector('tilos-dialog-content');
    this._state.content = newContent ? newContent : this._state.content;
    template(this._renderer, this._state, this._events);
  }
}

module.exports = TilosDialog;
