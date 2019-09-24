'use strict';

const HTMLCustomElement = require('../custom-element');

class TilosDialogHandler extends HTMLCustomElement {
  init() {
    this._events = {};
    this._events.onClick = this._onClickEvent.bind(this);
    this._state = {};
    this._state.dialog = null;
    this.addEventListener('click', this._events.onClick);
  }

  static get observedAttributes() {
    return ['dialog'];
  }

  set dialog(value) {
    if(value === this._state.dialog) return;
    this._state.dialog = value;
  }

  _onClickEvent() {
    if (!this._state.dialog) { console.warn('You forgot the id'); return; };
    const dialogElement = document.querySelector(this._state.dialog);
    if (!dialogElement) return;
    dialogElement.open();
  }
}

module.exports = TilosDialogHandler;
