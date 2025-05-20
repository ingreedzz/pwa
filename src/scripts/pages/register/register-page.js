import RegisterPresenter from './register-presenter';
import RegisterModel from '../../data/register-model';

export default class RegisterPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h1>Register</h1>
        <form id="register-form" class="form">
          <div class="form-group">
            <label for="name" class="form-label">Name:</label>
            <input type="text" id="name" name="name" class="form-input" required />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="email" name="email" class="form-input" required />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password:</label>
            <input type="password" id="password" name="password" class="form-input" required />
          </div>

          <button type="submit" class="submit-button">Register</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const model = new RegisterModel();
    this.#presenter = new RegisterPresenter(model, this);
    this.#presenter.init();
  }

  getFormElements() {
    const form = document.querySelector('#register-form');
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    return { form, name, email, password };
  }

  showMessage(message) {
    alert(message); // Handle alert in the view
  }

  redirectTo(hash) {
    location.hash = hash; // Handle navigation in the view
  }
}