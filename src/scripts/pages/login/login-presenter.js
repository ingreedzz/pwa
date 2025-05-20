import LoginModel from '../../data/login-model';
import { subscribeUserToPush } from '../../utils/push';

export default class LoginPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    const { form } = this.view.getFormElements();
    form.addEventListener('submit', this._handleFormSubmit.bind(this));
  }

  async _handleFormSubmit(event) {
    event.preventDefault();
    const { email, password } = this.view.getFormElements();

    if (!email.value.trim() || !password.value.trim()) {
      this.view.showMessage('Please fill in all required fields.');
      return;
    }

    try {
      const data = await this.model.login({
        email: email.value.trim(),
        password: password.value.trim(),
      });
      if (data.loginResult?.token) {
        this.view.showMessage('Login successful!');
        localStorage.setItem('token', data.loginResult.token);
        this.view.redirectTo('#/add-story');
      } else {
        this.view.showMessage(`Login failed: ${data.message}`);
      }
    } catch (error) {
      this.view.showMessage('An error occurred. Please try again.');
    }
  }
}