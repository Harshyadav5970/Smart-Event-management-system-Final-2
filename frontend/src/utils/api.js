// Harsh Yadav - TYCS Roll 129
// EventHub: Smart College Event & Fest Management System
// College Fest Portal 2026
// Resilient Hybrid API Client with Automatic Offline Fallback

import { handleClientFallback } from './clientFallback';

const BASE_URL = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('eventhub_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // 1. First attempt: standard /api endpoint (Vite proxy / Express server)
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If server responds with 405 (Static host like GitHub Pages / Live Server rejecting POST)
    // or 404 (no backend route on current host), fallback immediately!
    if (res.status === 405 || res.status === 404) {
      console.warn(`[EventHub API] Server returned status ${res.status} on ${endpoint}. Attempting local backend or offline engine...`);
      return await tryDirectBackendOrFallback(endpoint, options, headers);
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      return { success: false, message: errorMsg, status: res.status };
    }

    return data;
  } catch (err) {
    // Network failure (server stopped or cross-origin)
    console.warn(`[EventHub API] Network fetch failed on ${endpoint}. Trying direct port 5000 or offline fallback...`);
    return await tryDirectBackendOrFallback(endpoint, options, headers);
  }
}

// Fallback helper: Tries direct localhost:5000, and if unavailable, seamlessly uses client storage engine
async function tryDirectBackendOrFallback(endpoint, options, headers) {
  // Try localhost:5000 if not already tried
  if (typeof window !== 'undefined' && window.location.port !== '5000') {
    try {
      const directRes = await fetch(`http://localhost:5000/api${endpoint}`, {
        ...options,
        headers,
      });

      if (directRes.ok) {
        const directData = await directRes.json().catch(() => ({}));
        return directData;
      }
    } catch (e) {
      // Localhost:5000 not reachable (e.g. GitHub Pages or backend offline)
    }
  }

  // Seamless in-browser client fallback
  try {
    return await handleClientFallback(endpoint, options);
  } catch (clientErr) {
    console.error('[EventHub] Fallback error:', clientErr);
    return {
      success: false,
      message: 'Operation failed. Please try again.'
    };
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
