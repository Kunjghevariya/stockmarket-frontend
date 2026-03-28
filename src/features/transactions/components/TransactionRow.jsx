import { memo } from 'react';
import {
  formatCurrency,
  formatDateTime,
  formatRelativeTime,
  formatShares,
  humanizeTradeType,
} from '../../../shared/utils/formatters';

function TransactionRow({ transaction }) {
  const isBuy = transaction.type === 'buy';

  return (
    <div className="mx-1 my-1 flex h-[92px] items-center justify-between rounded-[1.25rem] border border-slate-100 bg-white px-4">
      <div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
              isBuy ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            {humanizeTradeType(transaction.type)}
          </span>
          <span className="text-sm font-semibold text-slate-900">{transaction.symbol}</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          {formatRelativeTime(transaction.executedAt || transaction.date)} • {formatDateTime(transaction.executedAt || transaction.date)}
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-semibold text-slate-900">
          {formatShares(transaction.quantity)} at {formatCurrency(transaction.price)}
        </div>
        <div className="mt-2 text-xs text-slate-500">Order total: {formatCurrency(transaction.totalValue)}</div>
      </div>
    </div>
  );
}

export default memo(TransactionRow);
