import AddStoryPresenter from './add-story-presenter';
import StoryModel from '../../data/story-model';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure Leaflet's default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x, // Add this line for retina displays
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default class AddStoryView {
  #presenter;

  constructor() {
    this._presenter = null;
  }

  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Add New Story</h1>
        <form id="add-story-form" class="story-form">
          <div class="form-group">
            <label for="description" class="form-label">Description:</label>
            <textarea id="description" name="description" class="form-input" required></textarea>
          </div>
          <div class="form-group">
            <label for="photo" class="form-label">Upload Photo:</label>
            <input type="file" id="photo" name="photo" accept="image/*" class="form-input" />
          </div>
          <div class="form-group">
            <button type="submit" class="submit-button">Submit</button>
          </div>
        </form>
        <h2>Saved Stories</h2>
        <div id="saved-stories-container" class="stories-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const model = new StoryModel();
    this.#presenter = new AddStoryPresenter(model, this);
    this.#presenter.init();

    // Handler to stop camera
    const stopCameraHandler = () => {
      if (this.#presenter && typeof this.#presenter.cleanup === 'function') {
        this.#presenter.cleanup();
      }
    };

    // Remove previous listeners to avoid duplicates
    window.removeEventListener('beforeunload', stopCameraHandler);
    window.removeEventListener('hashchange', stopCameraHandler);

    // Add listeners to stop camera on navigation or refresh
    window.addEventListener('beforeunload', stopCameraHandler);
    window.addEventListener('hashchange', stopCameraHandler);
  }

  updateStoriesContainer(stories) {
    const container = document.querySelector('#saved-stories-container');
    container.innerHTML = stories
      .map(
        (story) => `
          <div class="story-card">
            <a href="#/story/${story.id}">
              <img src="${story.photoUrl}" alt="Story by ${story.name}" class="story-image" />
              <div class="story-content">
                <h3>${story.name}</h3>
                <p>${story.description}</p>
              </div>
            </a>
          </div>
        `
      )
      .join('');
  }

  showMessage(message) {
    alert(message);
  }

  getFormElements() {
    const form = document.querySelector('#add-story-form');
    const description = document.querySelector('#description');
    const photoInput = document.querySelector('#photo');
    return { form, description, photoInput };
  }

  resetForm() {
    const { form } = this.getFormElements();
    form.reset();
  }
}