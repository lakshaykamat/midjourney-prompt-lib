// lib/api.ts
import ky from 'ky';

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      request => {
        // Add auth token if needed
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
  retry: {
    limit: 2,
    methods: ['get', 'post', 'put', 'delete'],
  },
});

export default api;
