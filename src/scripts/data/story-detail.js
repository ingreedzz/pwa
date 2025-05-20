import { fetchWithAuth } from './api';

export default class StoryDetailModel {
  async getStoryDetail(id) {
    return fetchWithAuth(`https://story-api.dicoding.dev/v1/stories/${id}`);
  }
}