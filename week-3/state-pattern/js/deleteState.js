import {UI} from './ui.js';

export class DeleteState {
  constructor(page, db) {
    this.page = page;
    this.db = db;  

    this.init();
  }

  init() {
    const ui = new UI();
    ui.deletePost();
  }
}