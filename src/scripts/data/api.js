import CONFIG from '../config';

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/your/endpoint/here`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must log in to perform this action.');
    location.hash = '#/login';
    throw new Error('Missing authentication token');
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    alert('Your session has expired. Please log in again.');
    localStorage.removeItem('token'); // Clear the invalid token
    location.hash = '#/login'; // Redirect to the login page
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch');
  }

  return response.json();
}

export async function getStories() {
  return await fetchWithAuth('https://story-api.dicoding.dev/v1/stories');
}

export async function addStory(formData) {
  try {
    await fetchWithAuth('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      body: formData,
    });
    alert('Story added successfully!');
  } catch (error) {
    console.error('Error:', error);
    alert(`An error occurred while adding the story: ${error.message}`);
  }
}