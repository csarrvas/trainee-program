import {UI} from './ui.js';

export class EditState {
  constructor() {
    this.init();
  }

  init() {
    const ui = new UI();
    ui.editPost();
  }
}