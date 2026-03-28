import { useEffect, useMemo, useState } from 'react';
import { buyStock, sellStock } from '../../portfolio/api/portfolioApi';
import { usePortfolio } from '../../portfolio/PortfolioContext';
import { useWatchlist } from '../../watchlist/WatchlistContext';
import { fetchChart } from '../api/marketApi';
import SearchResults from '../components/SearchResults';
import TradeModal from '../components/TradeModal';
import WatchlistRow from '../components/WatchlistRow';
import useSymbolSearch from '../hooks/useSymbolSearch';
import AsyncLineChart from '../../../shared/components/AsyncLineChart';
import EmptyState from '../../../shared/components/EmptyState';
import PageLoader from '../../../shared/components/PageLoader';
import SectionCard from '../../../shared/components/SectionCard';
import useQuotes from '../../../shared/hooks/useQuotes';
import { formatCurrency } from '../../../shared/utils/formatters';

export default function MarketPage() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { refreshPortfolio } = usePortfolio();
  const { quotes, getQuote, refresh: refreshQuotes, loading: isLoadingQuotes } = useQuotes(watchlist);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [chartData, setChartData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeIntent, setTradeIntent] = useState({ symbol: '', type: '' });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [pageError, setPageError] = useState('');
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const { results, loading: isSearching } = useSymbolSearch(searchQuery);

  useEffect(() => {
    if (!selectedSymbol && watchlist.length > 0) {
      setSelectedSymbol(watchlist[0]);
    }
  }, [selectedSymbol, watchlist]);

  useEffect(() => {
    let ignore = false;

    if (!selectedSymbol) {
      setChartData([]);
      return undefined;
    }

    const loadChart = async () => {
      setIsLoadingChart(true);
      try {
        const payload = await fetchChart(selectedSymbol);
        if (!ignore) {
          setChartData(Array.isArray(payload?.points) ? payload.points : Array.isArray(payload) ? payload : []);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to load chart', error);
          setChartData([]);
        }
      } finally {
        if (!ignore) {
          setIsLoadingChart(false);
        }
      }
    };

    loadChart();

    return () => {
      ignore = true;
    };
  }, [selectedSymbol]);

  const activeQuote = useMemo(() => getQuote(selectedSymbol), [getQuote, selectedSymbol]);

  const handleSelectSearchResult = async (symbol) => {
    setSearchQuery('');
    await addToWatchlist(symbol);
    setSelectedSymbol(symbol);
  };

  const handleTrade = async ({ quantity, price }) => {
    const { symbol, type } = tradeIntent;
    setIsSubmittingOrder(true);
    setPageError('');

    try {
      if (type === 'buy') {
        await buyStock({
          symbol,
          quantity,
          purchasePrice: price,
        });
      } else {
        await sellStock({
          symbol,
          quantity,
          ...(price > 0 ? { salePrice: price } : {}),
        });
      }

      await Promise.all([refreshPortfolio(), refreshQuotes()]);
      setTradeIntent({ symbol: '', type: '' });
    } catch (error) {
      console.error('Trade submission failed', error);
      setPageError(error?.data?.message || error.message || 'Trade failed');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.5fr]">
      <div className="space-y-6">
        <SectionCard title="Find something worth watching" description="Search by company or ticker, then save anything that catches your eye.">
          <div className="space-y-4">
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              placeholder="Try Apple, NVDA, TSLA, or any ticker you know"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />

            {isSearching ? <PageLoader label="Looking through the market" /> : null}
            {!isSearching && searchQuery.trim() && results.length > 0 ? (
              <SearchResults results={results} onSelect={handleSelectSearchResult} />
            ) : null}
          </div>
        </SectionCard>

        <SectionCard
          title="Your saved ideas"
          description="This watchlist belongs only to the current signed-in account, so it stays personal and tidy."
          action={
            <button
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
              type="button"
              onClick={refreshQuotes}
            >
              Check prices
            </button>
          }
        >
          {watchlist.length === 0 ? (
            <EmptyState
              title="You have not saved anything yet"
              description="Search for a ticker above and save it here when you want to follow it over time."
            />
          ) : (
            <div className="space-y-3">
              {watchlist.map((symbol) => (
                <WatchlistRow
                  key={symbol}
                  symbol={symbol}
                  quote={quotes[symbol]}
                  isActive={selectedSymbol === symbol}
                  onSelect={setSelectedSymbol}
                  onBuy={(nextSymbol) => setTradeIntent({ symbol: nextSymbol, type: 'buy' })}
                  onSell={(nextSymbol) => setTradeIntent({ symbol: nextSymbol, type: 'sell' })}
                  onRemove={removeFromWatchlist}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard title="The story behind the symbol" description="Charts load only when you ask for them, so the app still feels fast.">
          {!selectedSymbol ? (
            <EmptyState
              title="Pick something from your watchlist"
              description="Once you select a symbol, you will see its latest price context and a simple chart."
            />
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-[1.2fr_repeat(2,minmax(0,1fr))]">
                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">You are looking at</div>
                  <div className="mt-3 text-3xl font-semibold">{selectedSymbol}</div>
                  <div className="mt-2 text-sm text-slate-300">
                    {activeQuote?.current ? `${formatCurrency(activeQuote.current)} right now` : 'Live quote unavailable'}
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-white/80 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Opened today at</div>
                  <div className="mt-3 text-2xl font-semibold text-slate-900">
                    {activeQuote?.open ? formatCurrency(activeQuote.open) : 'Unavailable'}
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-white/80 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Closed yesterday at</div>
                  <div className="mt-3 text-2xl font-semibold text-slate-900">
                    {activeQuote?.prevClose ? formatCurrency(activeQuote.prevClose) : 'Unavailable'}
                  </div>
                </div>
              </div>

              {isLoadingChart ? (
                <PageLoader label="Loading the latest chart" />
              ) : chartData.length > 0 ? (
                <AsyncLineChart dataPoints={chartData} label={`${selectedSymbol} close`} yLabel="Price" />
              ) : (
                <EmptyState
                  title="We could not tell a chart story just yet"
                  description="The symbol is valid, but its recent chart data is not available right now."
                />
              )}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Ready to make a move?" description="Buying and selling update your personal portfolio right away.">
          {pageError ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{pageError}</p> : null}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white/80 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Latest price check</div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">
                {isLoadingQuotes ? 'Updating...' : activeQuote?.current ? formatCurrency(activeQuote.current) : 'Unavailable'}
              </div>
            </div>
            <button
              className="rounded-[1.5rem] bg-emerald-600 p-5 text-left text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => setTradeIntent({ symbol: selectedSymbol, type: 'buy' })}
              disabled={!selectedSymbol}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">Buy</div>
              <div className="mt-3 text-2xl font-semibold">Add {selectedSymbol || 'a position'}</div>
            </button>
            <button
              className="rounded-[1.5rem] bg-slate-900 p-5 text-left text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => setTradeIntent({ symbol: selectedSymbol, type: 'sell' })}
              disabled={!selectedSymbol}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Sell</div>
              <div className="mt-3 text-2xl font-semibold">Trim {selectedSymbol || 'a position'}</div>
            </button>
          </div>
        </SectionCard>
      </div>

      <TradeModal
        symbol={tradeIntent.symbol}
        type={tradeIntent.type}
        quote={getQuote(tradeIntent.symbol)}
        isSubmitting={isSubmittingOrder}
        onClose={() => setTradeIntent({ symbol: '', type: '' })}
        onSubmit={handleTrade}
      />
    </div>
  );
}
