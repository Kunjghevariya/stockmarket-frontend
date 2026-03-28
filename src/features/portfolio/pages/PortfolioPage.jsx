import { useMemo } from 'react';
import { usePortfolio } from '../PortfolioContext';
import HoldingRow from '../components/HoldingRow';
import EmptyState from '../../../shared/components/EmptyState';
import PageLoader from '../../../shared/components/PageLoader';
import SectionCard from '../../../shared/components/SectionCard';
import useQuotes from '../../../shared/hooks/useQuotes';
import { formatCurrency, formatNumber } from '../../../shared/utils/formatters';

export default function PortfolioPage() {
  const { portfolio, loading, refreshPortfolio } = usePortfolio();
  const holdingSymbols = useMemo(
    () => portfolio.holdings.map((holding) => holding.symbol),
    [portfolio.holdings]
  );
  const { quotes, refresh: refreshQuotes } = useQuotes(holdingSymbols, { pollInterval: 20000 });

  const estimatedValue = useMemo(
    () =>
      portfolio.holdings.reduce((total, holding) => {
        const currentPrice = Number(quotes[holding.symbol]?.current || 0);
        return total + currentPrice * Number(holding.quantity || 0);
      }, 0),
    [portfolio.holdings, quotes]
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="Your money at work"
        description="This view stays focused on your own account, with live pricing and plain-language totals."
        action={
          <div className="flex gap-2">
            <button
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
              type="button"
              onClick={refreshQuotes}
            >
              Check prices
            </button>
            <button
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
              type="button"
              onClick={refreshPortfolio}
            >
              Refresh positions
            </button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Open positions</div>
            <div className="mt-3 text-3xl font-semibold">{formatNumber(portfolio.holdingsCount)}</div>
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Money committed</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">{formatCurrency(portfolio.totalInvestment)}</div>
          </div>
          <div className="rounded-[1.5rem] bg-white/80 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Worth right now</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">{formatCurrency(estimatedValue)}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Positions you are carrying" description="Each row is written to be quick to scan and easier to understand.">
        {loading ? (
          <PageLoader label="Loading your portfolio" />
        ) : portfolio.holdings.length === 0 ? (
          <EmptyState
            title="No positions yet"
            description="Once you buy something from the market page, it will start showing up here."
          />
        ) : (
          <div className="space-y-3">
            {portfolio.holdings.map((holding) => (
              <HoldingRow key={holding.symbol} holding={holding} quote={quotes[holding.symbol]} />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
