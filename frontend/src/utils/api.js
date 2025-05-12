// src/utils/api.js

// Extract CSRF token from cookies (for session-based auth)
export function getCSRFToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Universal API request function
 *
 * @param {string} method - HTTP method: 'GET' or 'POST'
 * @param {string} url - Endpoint URL
 * @param {object} [data] - Payload for POST
 * @param {object} [options] - { token?: string, useSession?: boolean }
 * @returns {Promise<object>} JSON response
 */
export async function apiRequest(method, url, data = {}, options = {}) {
  const { token = null, useSession = false } = options;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  if (useSession) {
    const csrfToken = getCSRFToken();
    if (!csrfToken && method === 'POST') {
      throw new Error('Missing CSRF token for session POST');
    }
    headers['X-CSRFToken'] = csrfToken;
  }

  const fetchOptions = {
    method,
    headers,
    credentials: useSession ? 'include' : 'same-origin',
  };

  if (method === 'POST') {
    fetchOptions.body = JSON.stringify(data);
  }

  const response = await fetch(method === 'GET' && data && Object.keys(data).length
    ? `${url}?${new URLSearchParams(data).toString()}`
    : url,
    fetchOptions
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}
