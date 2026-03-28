const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
const ACCESS_TOKEN_KEY = 'accessToken';

export function getStoredAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredAccessToken(token) {
  if (!token) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearStoredAccessToken() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function unwrapResponse(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload && 'success' in payload) {
    return payload.data;
  }

  return payload;
}

export async function apiRequest(endpoint, options = {}) {
  const token = options.token ?? getStoredAccessToken();
  const hasBody = typeof options.body !== 'undefined';
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers,
    body: hasBody ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return unwrapResponse(payload);
}
