import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartComp({
  candles = [],
  lineData = [],
  selectedStock,
  mode = "stock"   // "stock" | "portfolio"
}) {
  const safeCandles = Array.isArray(candles) ? candles : [];
  const safeLine = Array.isArray(lineData) ? lineData : [];

  const data = useMemo(() => {
    if (mode === "portfolio") {
      // Portfolio line chart
      return {
        labels: safeLine.map(pt =>
          new Date(pt.time * 1000).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Portfolio Value",
            data: safeLine.map(pt => pt.value),
            fill: true,
            tension: 0.15,
            pointRadius: 2,
            borderWidth: 2,
          }
        ]
      };
    }

    // STOCK PRICE MODE
    const labels = safeCandles.map(c => {
      try { return new Date(c.time * 1000).toLocaleDateString(); }
      catch { return ''; }
    });

    const values = safeCandles.map(c => (c.close ?? c.price ?? null));

    return {
      labels,
      datasets: [{
        label: selectedStock ? `${selectedStock} Close` : 'Close',
        data: values,
        fill: false,
        tension: 0.15,
        pointRadius: 2,
      }]
    };
  }, [mode, safeCandles, safeLine, selectedStock]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text:
          mode === "portfolio"
            ? "Portfolio Performance"
            : selectedStock
              ? `${selectedStock} (1mo)`
              : "Chart"
      }
    },
    scales: {
      x: { display: true },
      y: { display: true, title: { display: true, text: mode === "portfolio" ? 'Value' : 'Price' } }
    }
  }), [mode, selectedStock]);

  if (mode === "portfolio" && !safeLine.length)
    return <div className="p-4">No portfolio performance data</div>;

  if (mode === "stock" && !safeCandles.length)
    return <div className="p-4">No chart data</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <Line data={data} options={options} />
    </div>
  );
}
