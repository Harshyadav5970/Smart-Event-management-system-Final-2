// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// API Client Helper with Token Interceptor

const BASE_URL = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('eventhub_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    let res;
    try {
      res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (networkErr) {
      // If relative endpoint fails (e.g., opened on different port or static preview), retry directly against backend port 5000
      if (!BASE_URL.startsWith('http')) {
        res = await fetch(`http://localhost:5000/api${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        throw networkErr;
      }
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      return { success: false, message: errorMsg, status: res.status };
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    return {
      success: false,
      message: 'Network error: Please ensure backend server is running on port 5000.',
    };
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
