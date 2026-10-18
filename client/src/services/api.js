const rawBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = 'https://om-natraj-dance-studio-backend.onrender.com/api';

export const getAuthToken = () => localStorage.getItem('om_natraj_admin_token');
export const setAuthToken = (token) => localStorage.setItem('om_natraj_admin_token', token);
export const removeAuthToken = () => localStorage.removeItem('om_natraj_admin_token');

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const api = {
  // Health Check
  checkHealth: () => request('/health'),

  // Public
  getSettings: () => request('/settings'),
  getClasses: (status = 'active') => request(`/classes${status ? `?status=${status}` : ''}`),
  getEvents: (status) => request(`/events${status ? `?status=${status}` : ''}`),
  getGallery: (param) => {
    if (!param) return request('/gallery');
    if (typeof param === 'string' && param.startsWith('?')) return request(`/gallery${param}`);
    return request(`/gallery?category=${param}`);
  },
  getVideos: () => request('/videos'),
  getProducts: (param) => {
    if (!param) return request('/products');
    if (typeof param === 'string' && param.startsWith('?')) return request(`/products${param}`);
    return request(`/products?category=${param}`);
  },
  getTestimonials: () => request('/testimonials'),
  submitLead: (leadData) => request('/leads', { method: 'POST', body: JSON.stringify(leadData) }),

  // Admin Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getAdminProfile: () => request('/auth/me'),

  // Admin Leads
  getLeads: (status, search) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    return request(`/leads?${params.toString()}`);
  },
  updateLead: (id, data) => request(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteLead: (id) => request(`/leads/${id}`, { method: 'DELETE' }),

  // Admin Classes
  createClass: (data) => request('/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id, data) => request(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClass: (id) => request(`/classes/${id}`, { method: 'DELETE' }),

  // Admin Events
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  // Admin Gallery
  createGalleryItem: (data) => request('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  updateGalleryItem: (id, data) => request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGalleryItem: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  // Admin Videos
  createVideo: (data) => request('/videos', { method: 'POST', body: JSON.stringify(data) }),
  updateVideo: (id, data) => request(`/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVideo: (id) => request(`/videos/${id}`, { method: 'DELETE' }),

  // Admin Products
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Admin Testimonials
  createTestimonial: (data) => request('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial: (id, data) => request(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial: (id) => request(`/testimonials/${id}`, { method: 'DELETE' }),

  // Admin Settings
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // File Upload (Images & Videos)
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload', {
      method: 'POST',
      body: formData,
    });
  }
};
