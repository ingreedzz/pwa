import LoginPresenter from './login-presenter';
import LoginModel from '../../data/login-model';

export default class LoginPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h1>Login</h1>
        <form id="login-form" class="form">
          <div class="form-group">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="email" name="email" class="form-input" required />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password:</label>
            <input type="password" id="password" name="password" class="form-input" required />
          </div>

          <button type="submit" class="submit-button">Login</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const model = new LoginModel();
    this.#presenter = new LoginPresenter(model, this);
    this.#presenter.init();
  }

  getFormElements() {
    const form = document.querySelector('#login-form');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    return { form, email, password };
  }

  showMessage(message) {
    alert(message); // Handle alert in the View
  }

  redirectTo(hash) {
    location.hash = hash; // Handle navigation in the View
  }
}