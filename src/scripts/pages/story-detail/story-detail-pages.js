import { parseActivePathname } from '../../routes/url-parser';
import StoryDetailPresenter from './story-detail-presenter';
import StoryDetailModel from '../../data/story-detail';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class StoryDetailPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <div id="story-detail" class="story-detail"></div>
        <div id="map" class="map-container"></div>
        <p>
          <a href="#/">Back to Home</a>
        </p>
      </section>
    `;
  }

  async afterRender() {
    const storyId = this._getStoryIdFromUrl();
    const model = new StoryDetailModel();
    this.#presenter = new StoryDetailPresenter(model, this, storyId);
    await this.#presenter.init();
  }

  _getStoryIdFromUrl() {
    const url = window.location.hash.split('/');
    return url[url.length - 1]; // Extract the story ID from the URL
  }

  showStory(story) {
    const detailContainer = document.querySelector('#story-detail');
    detailContainer.innerHTML = `
      <h1>${story.name}</h1>
      <img src="${story.photoUrl}" alt="Story by ${story.name}" class="story-image" />
      <p>${story.description}</p>
      <p><small>Created on: ${new Date(story.createdAt).toLocaleDateString()}</small></p>
    `;

    // Ensure the image has the correct size
    const storyImage = detailContainer.querySelector('.story-image');
    storyImage.style.width = '100%'; // Make the image responsive
    storyImage.style.maxWidth = '600px'; // Limit the maximum width
    storyImage.style.height = 'auto'; // Maintain aspect ratio
    storyImage.style.borderRadius = '8px'; // Add rounded corners
  }

  showMap(lat, lon, name) {
    const mapElement = this.getMapElement();
    if (!mapElement) {
      console.error('Map element not found in the DOM.');
      return;
    }

    const map = L.map(mapElement).setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lon]).addTo(map).bindPopup(`<b>${name}</b>`).openPopup();
  }

  getMapElement() {
    return document.querySelector('#map');
  }

  showError(message) {
    const detailContainer = document.querySelector('#story-detail');
    detailContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
}