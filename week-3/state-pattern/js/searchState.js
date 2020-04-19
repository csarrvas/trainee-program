import {UI} from './ui.js';

export class SearchState {
  constructor() {
    this.init();
  }

  init() {
    const ui = new UI();
    ui.displayWantedPost();
  }
}