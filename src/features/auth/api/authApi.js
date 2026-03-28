import { apiRequest } from '../../../shared/api/client';

export function registerUser(payload) {
  return apiRequest('/api/v1/users/register', {
    method: 'POST',
    body: payload,
  });
}

export function loginUser(payload) {
  return apiRequest('/api/v1/users/login', {
    method: 'POST',
    body: payload,
  });
}

export function loginWithDemoAccount() {
  return apiRequest('/api/v1/users/demo-login', {
    method: 'POST',
  });
}

export function logoutUser() {
  return apiRequest('/api/v1/users/logout', {
    method: 'POST',
  });
}

export function fetchCurrentUser() {
  return apiRequest('/api/v1/users/me');
}
