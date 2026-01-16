import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5030/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const eventTypeService = {
    getAll: () => api.get('/event-types'),
    getById: (id) => api.get(`/event-types/${id}`),
    getBySlug: (slug) => api.get(`/event-types/slug/${slug}`),
    create: (data) => api.post('/event-types', data),
    update: (id, data) => api.put(`/event-types/${id}`, data),
    delete: (id) => api.delete(`/event-types/${id}`),
};

export const availabilityService = {
    getAll: () => api.get('/availability'),
    getDefault: () => api.get('/availability/default'),
    getById: (id) => api.get(`/availability/${id}`),
    update: (id, data) => api.put(`/availability/${id}`, data),
    addOverride: (id, data) => api.post(`/availability/${id}/overrides`, data),
    deleteOverride: (id, overrideId) => api.delete(`/availability/overrides/${overrideId}`),
};

export const bookingService = {
    getSlots: (slug, date) => api.get(`/bookings/slots/${slug}/${date}`),
    create: (data) => api.post('/bookings', data),
    getById: (id) => api.get(`/bookings/${id}`),
    cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

export const meetingService = {
    getAll: (filter) => api.get(`/meetings?filter=${filter}`),
    getCounts: () => api.get('/meetings/counts'),
};

export default api;
