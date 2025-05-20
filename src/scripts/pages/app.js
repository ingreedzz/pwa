import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupLogout(); // Add this line
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      })
    });
  }

  _setupLogout() {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        location.hash = '#/login';
      });
    }
  }

  async renderPage() {
    const url = getActiveRoute(); // Get the current route
    const page = routes[url]; // Match the route to a page

    if (page) {
      if (document.startViewTransition) {
        document.startViewTransition(async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();
        });
      } else {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      }
    } else {
      this.#content.innerHTML = '<h1>Page Not Found</h1>'; // Handle invalid routes
    }
  }
}

export default App;
