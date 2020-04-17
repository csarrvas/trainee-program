import {UI} from './ui.js';

export class EditState {
  constructor(page, db) {
    this.page = page;
    this.db = db;  

    this.init();
  }

  init() {
    const ui = new UI();
    ui.editPost();
  }
}