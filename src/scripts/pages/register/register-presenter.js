import RegisterModel from '../../data/register-model';

export default class RegisterPresenter {
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
    const { name, email, password } = this.view.getFormElements();

    if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
      this.view.showMessage('Please fill in all required fields.');
      return;
    }

    try {
      const data = await this.model.register({
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
      });
      if (data.error) {
        this.view.showMessage(`Registration failed: ${data.message}`);
      } else {
        this.view.showMessage('Registration successful! Please log in.');
        this.view.redirectTo('#/login');
      }
    } catch (error) {
      this.view.showMessage('Registration failed. Please try again later.');
    }
  }
}