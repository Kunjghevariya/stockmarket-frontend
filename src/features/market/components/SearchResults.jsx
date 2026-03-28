import { memo } from 'react';

function SearchResults({ results, onSelect }) {
  return (
    <div className="glass-panel rounded-[1.25rem] p-2">
      {results.map((result) => (
        <button
          key={`${result.symbol}-${result.exchange || 'global'}`}
          className="flex w-full items-start justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-white"
          type="button"
          onClick={() => onSelect(result.symbol)}
        >
          <div>
            <div className="text-sm font-semibold text-slate-900">{result.shortname}</div>
            <div className="mt-1 text-xs text-slate-500">{result.symbol} • Tap to save it to your watchlist</div>
          </div>
          <div className="text-xs text-slate-400">{result.exchange || result.type || 'Market'}</div>
        </button>
      ))}
    </div>
  );
}

export default memo(SearchResults);
