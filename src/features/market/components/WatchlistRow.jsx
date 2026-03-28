import { memo } from 'react';
import { formatCurrency, formatPercent } from '../../../shared/utils/formatters';

function WatchlistRow({ symbol, quote, isActive, onSelect, onBuy, onSell, onRemove }) {
  const changePercent =
    Number(quote?.prevClose) > 0 && Number(quote?.current) > 0
      ? ((Number(quote.current) - Number(quote.prevClose)) / Number(quote.prevClose)) * 100
      : 0;
  const moveCopy = quote?.current
    ? `${changePercent >= 0 ? 'Up' : 'Down'} ${formatPercent(Math.abs(changePercent))} since the last close`
    : 'Waiting on the latest market data';

  return (
    <div
      className={`rounded-[1.25rem] border p-4 transition ${
        isActive ? 'border-teal-300 bg-teal-50/70' : 'border-slate-100 bg-white/80 hover:border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button className="text-left" type="button" onClick={() => onSelect(symbol)}>
          <div className="text-sm font-semibold text-slate-900">{symbol}</div>
          <div className="mt-1 text-xs text-slate-500">
            {quote?.current ? `${formatCurrency(quote.current)} right now` : 'Price unavailable'}
          </div>
          <div className={`mt-1 text-xs font-medium ${changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {moveCopy}
          </div>
        </button>

        <button
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          type="button"
          onClick={() => onRemove(symbol)}
        >
          Remove
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="flex-1 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
          type="button"
          onClick={() => onBuy(symbol)}
        >
          Buy
        </button>
        <button
          className="flex-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          type="button"
          onClick={() => onSell(symbol)}
        >
          Sell
        </button>
      </div>
    </div>
  );
}

export default memo(WatchlistRow);
