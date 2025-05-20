export default class LoginModel {
  async login({ email, password }) {
    const response = await fetch('https://story-api.dicoding.dev/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }
}