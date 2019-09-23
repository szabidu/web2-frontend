'use strict';
const hyperHTML = require('hyperhtml/umd');

const svg = hyperHTML.wire(null, 'svg')`
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>`;

module.exports = (render, state, events) => {
  state.checkbox =  hyperHTML.wire()`<input type="checkbox">`;

  const switcher = (defaultOpen) => {
    if(defaultOpen) {
      return hyperHTML.wire()`
      <span class="checkbox-inline">
        <label> ${state.checkbox} Ne jelenjen meg többet</label>
      </span>
    `;
    } else {
      return hyperHTML.wire()`<span></span>`;
    }
  };

  const prevent = event => event.stopPropagation();
  const dialogClassList = ['tilos-dialog'];

  if(state.open || state.forceOpen) {
    dialogClassList.push('tilos-dialog-open');
  }

  console.log(dialogClassList);
  return render`
    <div class="${dialogClassList.join(' ')}" onClick=${events.close}>
      <div class="tilos-dialog__container" onClick=${prevent}>
        <div class="tilos-dialog__header">${state.header} <span onClick=${events.close} class="tilos-dialog__close">${svg}</span></div>
        <div class="tilos-dialog__content">
          ${state.content}
        </div>
        <div class="tilos-dialog__footer">
          <button class="btn btn-info" onClick=${events.close}>Bezárás</button>
          ${switcher(state.defaultOpen)}
        </div>
      </div>
    </div>
  `;
}
