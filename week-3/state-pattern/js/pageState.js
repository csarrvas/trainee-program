export class PageState {
  constructor() {
    this.currentState = '';
  }

  init(state) {
    this.change(state);
  }

  change(state) {
    this.currentState = state;
  }
}