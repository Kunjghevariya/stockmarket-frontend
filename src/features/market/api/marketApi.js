import { apiRequest } from '../../../shared/api/client';

export function fetchQuote(symbol) {
  return apiRequest(`/api/v1/price/${encodeURIComponent(symbol)}`);
}

export function fetchChart(symbol, range = '1mo') {
  return apiRequest(`/api/v1/chart/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}`);
}

export function searchSymbols(query) {
  return apiRequest(`/api/v1/search?q=${encodeURIComponent(query)}`);
}

export function fetchNews({ q = '', category = 'business', pageSize = 24 } = {}) {
  const params = new URLSearchParams({
    category,
    pageSize: String(pageSize),
  });

  if (q) {
    params.set('q', q);
  }

  return apiRequest(`/api/v1/news?${params.toString()}`);
}

export function fetchWatchlist() {
  return apiRequest('/api/v1/watchlist');
}

export function addToWatchlist(stockSymbol) {
  return apiRequest('/api/v1/watchlist/add', {
    method: 'POST',
    body: { stockSymbol },
  });
}

export function removeFromWatchlist(stockSymbol) {
  return apiRequest('/api/v1/watchlist/remove', {
    method: 'POST',
    body: { stockSymbol },
  });
}
