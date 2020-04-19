import {UI} from './ui.js';

export class DeleteState {
  constructor() {
    this.init();
  }

  init() {
    const ui = new UI();
    ui.deletePost();
  }
}