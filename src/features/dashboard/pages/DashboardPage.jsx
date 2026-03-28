import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { usePortfolio } from '../../portfolio/PortfolioContext';
import { useWatchlist } from '../../watchlist/WatchlistContext';
import { fetchPortfolioPerformance } from '../../portfolio/api/portfolioApi';
import { fetchTransactions } from '../../transactions/api/transactionsApi';
import MetricCard from '../components/MetricCard';
import AsyncLineChart from '../../../shared/components/AsyncLineChart';
import EmptyState from '../../../shared/components/EmptyState';
import PageLoader from '../../../shared/components/PageLoader';
import SectionCard from '../../../shared/components/SectionCard';
import useQuotes from '../../../shared/hooks/useQuotes';
import {
  formatCompactDate,
  formatCurrency,
  formatNumber,
  formatRelativeTime,
  formatShares,
  formatSignedCurrency,
  humanizeTradeType,
} from '../../../shared/utils/formatters';

export default function DashboardPage() {
  const { user, demoCredentials } = useAuth();
  const { portfolio, loading: portfolioLoading } = usePortfolio();
  const { watchlist } = useWatchlist();
  const [performance, setPerformance] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);

  const holdingSymbols = useMemo(
    () => portfolio.holdings.map((holding) => holding.symbol),
    [portfolio.holdings]
  );
  const { quotes } = useQuotes(holdingSymbols, { pollInterval: 20000, ttl: 12000 });

  const estimatedValue = useMemo(
    () =>
      portfolio.holdings.reduce((total, holding) => {
        const currentPrice = Number(quotes[holding.symbol]?.current || 0);
        return total + currentPrice * Number(holding.quantity || 0);
      }, 0),
    [portfolio.holdings, quotes]
  );

  const profitLoss = estimatedValue - Number(portfolio.totalInvestment || 0);
  const leadHolding = useMemo(
    () =>
      [...portfolio.holdings].sort(
        (left, right) => Number(right.investedAmount || 0) - Number(left.investedAmount || 0)
      )[0],
    [portfolio.holdings]
  );
  const portfolioMood =
    profitLoss > 0
      ? `You are ahead by ${formatCurrency(profitLoss)} overall, and ${leadHolding?.symbol || 'your portfolio'} is doing most of the heavy lifting.`
      : profitLoss < 0
        ? `You are down ${formatCurrency(Math.abs(profitLoss))} overall right now, so this may be a good moment to review your strongest convictions.`
        : 'You are roughly flat overall, which can be a helpful reset point for deciding what to add or trim next.';

  useEffect(() => {
    let ignore = false;

    const loadDashboardData = async () => {
      setIsLoadingPerformance(true);

      try {
        const [performancePayload, transactionPayload] = await Promise.all([
          fetchPortfolioPerformance(),
          fetchTransactions({ pageSize: 5 }),
        ]);

        if (!ignore) {
          setPerformance(Array.isArray(performancePayload?.points) ? performancePayload.points : []);
          setRecentTransactions(Array.isArray(transactionPayload?.items) ? transactionPayload.items : []);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to load dashboard data', error);
          setPerformance([]);
          setRecentTransactions([]);
        }
      } finally {
        if (!ignore) {
          setIsLoadingPerformance(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="glass-panel overflow-hidden rounded-[2rem] px-6 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Your market home</div>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950">
              Good to see you, {user?.fullName?.split(' ')[0] || user?.username}.
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">{portfolioMood}</p>
          </div>

          {demoCredentials ? (
            <div className="rounded-[1.5rem] bg-white/80 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Demo details</div>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <div>Username: {demoCredentials.username}</div>
                <div>Password: {demoCredentials.password}</div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Money you put in"
          value={formatCurrency(portfolio.totalInvestment)}
          hint="The amount you have committed across your open positions."
          tone="neutral"
        />
        <MetricCard
          label="What it looks like now"
          value={formatCurrency(estimatedValue)}
          hint="Based on the latest live prices available in the app."
          tone="brand"
        />
        <MetricCard
          label="How you are doing"
          value={formatSignedCurrency(profitLoss)}
          hint={profitLoss >= 0 ? 'You are currently ahead overall.' : 'You are currently below your cost basis.'}
          tone="success"
        />
        <MetricCard
          label="What you are tracking"
          value={`${formatNumber(portfolio.holdingsCount)} positions`}
          hint={`${formatNumber(watchlist.length)} ideas saved to your watchlist`}
          tone="neutral"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <SectionCard title="Your portfolio over time" description="A simple month-long story of how your positions have moved together.">
          {isLoadingPerformance ? (
            <PageLoader label="Building your portfolio story" />
          ) : performance.length > 0 ? (
            <AsyncLineChart
              dataPoints={performance}
              label="Portfolio value"
              fill
              yLabel="Portfolio value"
            />
          ) : (
            <EmptyState
              title="There is not enough history yet"
              description="Make a few trades or open the demo workspace to see this trend line come to life."
            />
          )}
        </SectionCard>

        <SectionCard title="What you did recently" description="A quick, human-readable recap of the last few trades on this account.">
          {recentTransactions.length === 0 ? (
            <EmptyState
              title="Nothing to recap yet"
              description="Your latest buys and sells will show up here once you start placing orders."
            />
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="rounded-[1.25rem] border border-slate-100 bg-white/80 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {humanizeTradeType(transaction.type)} {formatShares(transaction.quantity)} of {transaction.symbol}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {formatRelativeTime(transaction.executedAt)} • {formatCompactDate(transaction.executedAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">{formatCurrency(transaction.totalValue)}</div>
                      <div className="mt-1 text-xs text-slate-500">Order size: {formatShares(transaction.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <SectionCard title="Your positions, in plain English" description="Live pricing refreshes automatically so you can understand each holding quickly.">
          {portfolioLoading ? (
            <PageLoader label="Loading your positions" />
          ) : portfolio.holdings.length === 0 ? (
            <EmptyState
              title="You do not have any open positions yet"
              description="Start with the market page when you are ready to build your first watchlist or trade."
            />
          ) : (
            <div className="space-y-3">
              {portfolio.holdings.map((holding) => {
                const liveValue = Number(quotes[holding.symbol]?.current || 0) * Number(holding.quantity || 0);
                return (
                  <div
                    key={holding.symbol}
                    className="grid gap-3 rounded-[1.25rem] border border-slate-100 bg-white/80 p-4 md:grid-cols-[1.4fr_1fr_1fr]"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{holding.symbol}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {formatShares(holding.quantity)} • average cost {formatCurrency(holding.purchasePrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Money in</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">
                        {formatCurrency(holding.investedAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Worth right now</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">{formatCurrency(liveValue)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Saved ideas" description="These are the symbols you have bookmarked to revisit later.">
          {watchlist.length === 0 ? (
            <EmptyState
              title="Nothing saved yet"
              description="Use the market page to save a few symbols you want to keep an eye on."
            />
          ) : (
            <div className="space-y-3">
              {watchlist.slice(0, 8).map((symbol) => (
                <div key={symbol} className="rounded-[1.25rem] border border-slate-100 bg-white/80 p-4">
                  <div className="text-sm font-semibold text-slate-900">{symbol}</div>
                  <div className="mt-1 text-xs text-slate-500">Ready whenever you want a closer look.</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
