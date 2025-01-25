import { API_URL, API_ROUTES } from '../config';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const fetchWithAuth = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

export const authAPI = {
  login: (email, password) => 
    fetchWithAuth(API_ROUTES.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (email, password) =>
    fetchWithAuth(API_ROUTES.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  logout: () => 
    fetchWithAuth(API_ROUTES.LOGOUT, { method: 'POST' }),

  checkAuth: () => 
    fetchWithAuth(API_ROUTES.CHECK_AUTH)
};

export const bookmarksAPI = {
  getAll: () => 
    fetchWithAuth(API_ROUTES.BOOKMARKS),

  create: (bookmarkData) =>
    fetchWithAuth(API_ROUTES.BOOKMARKS, {
      method: 'POST',
      body: JSON.stringify(bookmarkData)
    }),

  update: (id, bookmarkData) =>
    fetchWithAuth(`${API_ROUTES.BOOKMARKS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookmarkData)
    }),

  delete: (id) =>
    fetchWithAuth(`${API_ROUTES.BOOKMARKS}/${id}`, {
      method: 'DELETE'
    }),

  getPreview: (url) =>
    fetchWithAuth(`${API_ROUTES.PREVIEW}?url=${encodeURIComponent(url)}`)
};

export const collectionsAPI = {
  getAll: () => 
    fetchWithAuth(API_ROUTES.COLLECTIONS),

  create: (collectionData) =>
    fetchWithAuth(API_ROUTES.COLLECTIONS, {
      method: 'POST',
      body: JSON.stringify(collectionData)
    })
};

