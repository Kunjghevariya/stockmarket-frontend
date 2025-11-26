// src/utils/api.js
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function apiFetch(endpoint, opts = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    method: opts.method || 'GET',
    credentials: 'include',
    headers,
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
  };

  const res = await fetch(`${BASE}${endpoint}`, config);

  // try parse safe
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const err = new Error((data && data.message) || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export default apiFetch;
