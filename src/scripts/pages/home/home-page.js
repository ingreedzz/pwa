import HomePresenter from './home-presenter';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure Leaflet's default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default class HomePage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h1>Welcome to the Home Page</h1>
        <div id="map" class="map-container"></div>
        <h2>Stories</h2>
        <div id="stories-container" class="stories-container"></div>
        <h2>Saved Stories</h2>
        <div id="saved-stories-container" class="stories-container"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({ view: this });
    await this.#presenter.init();
  }

  displayStories(stories) {
    const container = document.querySelector('#stories-container');
    container.innerHTML = stories
      .map(
        (story) => `
          <div class="story-card">
            <a href="#/story/${story.id}">
              <img src="${story.photoUrl}" alt="Photo of ${story.name}'s story" class="story-image" />
              <div class="story-content">
                <h3>${story.name}</h3>
                <p>${story.description}</p>
                <p><small>Created on: ${new Date(story.createdAt).toLocaleDateString()}</small></p>
              </div>
            </a>
          </div>
        `
      )
      .join('');
  }

  displaySavedStories(stories) {
    const container = document.querySelector('#saved-stories-container');
    container.innerHTML = stories
      .map(
        (story) => `
          <div class="story-card">
            <a href="#/story/${story.id}">
              <img src="${story.photoUrl}" alt="Photo of ${story.name}'s story" class="story-image" />
              <div class="story-content">
                <h3>${story.name}</h3>
                <p>${story.description}</p>
                <p><small>Created on: ${new Date(story.createdAt).toLocaleDateString()}</small></p>
              </div>
            </a>
          </div>
        `
      )
      .join('');
  }

  renderMap(stories) {
    const mapElement = this.getMapElement();
    if (!mapElement) {
      console.error('Map element not found in the DOM.');
      return;
    }

    const map = L.map(mapElement).setView([-2.5489, 118.0149], 5); // Centered on Indonesia

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`)
          .openPopup();
      }
    });
  }

  getMapElement() {
    return document.querySelector('#map');
  }

  showError(message) {
    const container = document.querySelector('#stories-container');
    container.innerHTML = `<p class="error-message">${message}</p>`;
  }
}
