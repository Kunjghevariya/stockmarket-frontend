// src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import ChartComp from '../components/ChartComp';
import { usePortfolioCtx } from '../context/PortfolioContext';
import { useWatchlistCtx } from '../context/WatchlistContext';
import DataItem from '../components/DataItem';
import apiFetch from '../utils/api';

export default function Dashboard() {
  const { portfolio } = usePortfolioCtx();
  const { watchlist } = useWatchlistCtx();

  const invested = portfolio?.totalInvestment ?? 0;
  const holdings = portfolio?.holdings ?? [];

  const [chartData, setChartData] = useState([]);
  const watchlistMemo = useMemo(() => watchlist.slice(0, 10), [watchlist]);

  useEffect(() => {
    if (holdings.length === 0) return;

    const loadPortfolioChart = async () => {
      try {
        let timelineMap = {};

        // Fetch chart for each stock
        for (let h of holdings) {
          const candles = await apiFetch(`/api/v1/chart/${h.symbol}?range=1mo`);

          candles.forEach(c => {
            const t = c.time; // unix timestamp
            const value = c.close * h.quantity;

            if (!timelineMap[t]) timelineMap[t] = 0;
            timelineMap[t] += value;
          });
        }

        // Convert merged map to sorted array
        const merged = Object.entries(timelineMap)
          .map(([time, value]) => ({ time: Number(time), value }))
          .sort((a, b) => a.time - b.time);

        setChartData(merged);
      } catch (err) {
        console.error("Portfolio chart error", err);
      }
    };

    loadPortfolioChart();

  }, [holdings]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="col-span-2">
          <h2 className="text-2xl mb-2">Portfolio</h2>
          {holdings.map(h => <DataItem key={h.symbol} item={h} />)}
        </div>

        <div>
          <div className="mb-4 bg-white p-4 rounded shadow">
            <h3 className="text-sm text-gray-500">Invested</h3>
            <div className="text-3xl">{invested}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3>Watchlist</h3>
            <ul>{watchlistMemo.map(s => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-2xl mb-2">Portfolio Performance</h2>

        <ChartComp
  mode="portfolio"
  lineData={chartData}
  selectedStock="PORTFOLIO"
/>

        />
      </div>
    </div>
  );
}
