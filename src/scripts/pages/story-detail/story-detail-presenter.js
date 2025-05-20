import StoryDetailModel from '../../data/story-detail';

export default class StoryDetailPresenter {
  constructor(model, view, storyId) {
    this._model = model;
    this._view = view;
    this._storyId = storyId;
  }

  async init() {
    try {
      const response = await this._model.getStoryDetail(this._storyId);
      const { story } = response;
      this._view.showStory(story); // Delegate rendering to the view
      this._view.showMap(story.lat, story.lon, story.name); // Delegate map rendering to the view
    } catch (error) {
      console.error('Error fetching story detail:', error);
      this._view.showError('Failed to load story detail. Please try again later.');
    }
  }
}