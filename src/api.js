const API_BASE = 'http://127.0.0.1:8000';

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : '';
}

export async function apiFetch(url, options = {}) {
  const method = options.method || 'GET';
  const headers = { ...(options.headers || {}) };
  const csrfToken = getCookie('csrftoken');

  if (method !== 'GET' && csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  return response;
}
