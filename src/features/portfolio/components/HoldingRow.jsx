import { memo } from 'react';
import { formatCurrency, formatPercent, formatShares, formatSignedCurrency } from '../../../shared/utils/formatters';

function HoldingRow({ holding, quote }) {
  const currentPrice = Number(quote?.current || 0);
  const investedAmount = Number(holding.investedAmount || 0);
  const currentValue = currentPrice * Number(holding.quantity || 0);
  const profitLoss = currentValue - investedAmount;
  const profitLossPercent = investedAmount > 0 ? (profitLoss / investedAmount) * 100 : 0;

  return (
    <div className="grid gap-3 rounded-[1.25rem] border border-slate-100 bg-white/80 p-4 md:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
      <div>
        <div className="text-sm font-semibold text-slate-900">{holding.symbol}</div>
        <div className="text-xs text-slate-500">
          {formatShares(holding.quantity)} • average cost {formatCurrency(holding.purchasePrice)}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Money in</div>
        <div className="mt-1 text-sm font-semibold text-slate-800">{formatCurrency(investedAmount)}</div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Price now</div>
        <div className="mt-1 text-sm font-semibold text-slate-800">
          {currentPrice ? formatCurrency(currentPrice) : 'Unavailable'}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Worth now</div>
        <div className="mt-1 text-sm font-semibold text-slate-800">{formatCurrency(currentValue)}</div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Gain or loss</div>
        <div className={`mt-1 text-sm font-semibold ${profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {formatSignedCurrency(profitLoss)} ({formatPercent(profitLossPercent)})
        </div>
      </div>
    </div>
  );
}

export default memo(HoldingRow);
