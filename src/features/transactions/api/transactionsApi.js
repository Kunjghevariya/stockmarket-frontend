import { apiRequest } from '../../../shared/api/client';

export function fetchTransactions({ page = 1, pageSize = 100, type = 'all' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (type !== 'all') {
    params.set('type', type);
  }

  return apiRequest(`/api/v1/transactions?${params.toString()}`);
}
