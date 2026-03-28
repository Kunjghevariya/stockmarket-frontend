import { apiRequest } from '../../../shared/api/client';

export function fetchPortfolio() {
  return apiRequest('/api/v1/portfolio');
}

export function fetchPortfolioPerformance(range = '1mo') {
  return apiRequest(`/api/v1/portfolio/performance?range=${encodeURIComponent(range)}`);
}

export function buyStock(payload) {
  return apiRequest('/api/v1/portfolio/buy', {
    method: 'POST',
    body: payload,
  });
}

export function sellStock(payload) {
  return apiRequest('/api/v1/portfolio/sell', {
    method: 'POST',
    body: payload,
  });
}
