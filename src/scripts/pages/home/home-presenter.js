import { getStories } from '../../data/api';


export default class HomePresenter {
  constructor({ view }) {
    this._view = view;
  }

  async init() {
    if (!localStorage.getItem('token')) {
      this._view.showError('Please log in to view stories.');
      return;
    }

    try {
      // Fetch stories from the API
      const stories = await getStories();
      this._view.displayStories(stories.listStory);
    } catch (error) {
      console.error('Error fetching stories:', error);
      this._view.showError('Failed to load stories. Please try again later.');
    }
  }
}