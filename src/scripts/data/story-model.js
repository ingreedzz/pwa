import { fetchWithAuth } from './api';

export default class StoryModel {
  async addStory(formData) {
    return fetchWithAuth('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      body: formData,
    });
  }

  async getStories() {
    return fetchWithAuth('https://story-api.dicoding.dev/v1/stories?location=1');
  }
}