export default class AboutPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  loadContent() {
    return this.#view.render(); // Delegate rendering to the view
  }
}