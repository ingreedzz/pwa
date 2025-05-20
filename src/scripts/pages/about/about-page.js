import AboutPresenter from './about-presenter';

export default class AboutPage {
  #presenter;

  async render() {
    return `
      <section class="about-hero">
        <div class="hero-content">
          <h1>About This Project</h1>
          <p>Discover the story-sharing platform built with modern web technologies.</p>
        </div>
      </section>
      <section class="about-content container">
        <div class="about-card">
          <h2>What is This Project?</h2>
          <p>
            This project is a web application built using modern web development tools such as Webpack, Babel, and Leaflet. 
            It serves as a platform for users to share stories with photos and geolocation data.
          </p>
        </div>
        <div class="about-card">
          <h2>Features</h2>
          <ul>
            <li><i class="fas fa-user"></i> User registration and login</li>
            <li><i class="fas fa-map-marker-alt"></i> Add stories with geolocation</li>
            <li><i class="fas fa-camera"></i> Upload photos or capture via webcam</li>
            <li><i class="fas fa-globe"></i> Explore stories on an interactive map</li>
          </ul>
        </div>
        <div class="about-card">
          <h2>Design Philosophy</h2>
          <p>
            The application follows the MVP (Model-View-Presenter) design pattern to ensure a clean separation of concerns 
            between the user interface, business logic, and data handling.
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AboutPresenter({ view: this });
    this.#presenter.loadContent();
  }
}
