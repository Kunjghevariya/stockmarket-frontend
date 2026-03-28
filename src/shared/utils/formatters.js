export function formatCurrency(value) {
  if (!Number.isFinite(Number(value))) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatPercent(value) {
  if (!Number.isFinite(Number(value))) {
    return '0.00%';
  }

  return `${Number(value).toFixed(2)}%`;
}

export function formatSignedCurrency(value) {
  const numericValue = Number(value || 0);
  const sign = numericValue > 0 ? '+' : numericValue < 0 ? '-' : '';
  return `${sign}${formatCurrency(Math.abs(numericValue))}`;
}

export function formatNumber(value) {
  if (!Number.isFinite(Number(value))) {
    return '0';
  }

  return new Intl.NumberFormat('en-US').format(Number(value));
}

export function formatDateTime(value) {
  if (!value) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatCompactDate(value) {
  if (!value) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function formatRelativeTime(value) {
  if (!value) {
    return 'just now';
  }

  const targetTime = new Date(value).getTime();
  const now = Date.now();
  const difference = targetTime - now;
  const absoluteDifference = Math.abs(difference);
  const formatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

  const units = [
    { label: 'year', value: 1000 * 60 * 60 * 24 * 365 },
    { label: 'month', value: 1000 * 60 * 60 * 24 * 30 },
    { label: 'week', value: 1000 * 60 * 60 * 24 * 7 },
    { label: 'day', value: 1000 * 60 * 60 * 24 },
    { label: 'hour', value: 1000 * 60 * 60 },
    { label: 'minute', value: 1000 * 60 },
  ];

  for (const unit of units) {
    if (absoluteDifference >= unit.value) {
      return formatter.format(Math.round(difference / unit.value), unit.label);
    }
  }

  return 'just now';
}

export function formatShares(value) {
  const numericValue = Number(value || 0);
  const formattedValue = Number.isInteger(numericValue)
    ? formatNumber(numericValue)
    : numericValue.toFixed(2);

  return `${formattedValue} share${numericValue === 1 ? '' : 's'}`;
}

export function humanizeTradeType(value) {
  if (value === 'buy') {
    return 'Bought';
  }

  if (value === 'sell') {
    return 'Sold';
  }

  return value;
}

export function titleCase(value) {
  return String(value || '')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
