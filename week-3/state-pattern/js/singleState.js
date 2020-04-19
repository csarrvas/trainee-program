import {UI} from './ui.js';

export class SingleState {
  constructor() {
    this.init();
  }

  init() {
    const ui = new UI();
    ui.displayPost();
  }
}