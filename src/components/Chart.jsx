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
  Legend,
} from 'chart.js';
import { usePortfolioCtx } from '../context/PortfolioContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const { portfolio } = usePortfolioCtx();
  const holdings = portfolio?.statusCode?.holdings || [];

  const chartData = useMemo(() => {
    if (!holdings.length) return null;

    const labels = holdings.map(h => h.symbol);
    const prices = holdings.map(h => h.purchasePrice);

    return {
      labels,
      datasets: [
        {
          label: 'Portfolio Holdings',
          data: prices,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
        },
      ],
    };
  }, [holdings]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Portfolio Overview' },
      },
    }),
    []
  );

  return (
    <div className="bg-white rounded-md shadow-md m-4 p-4 md:p-10">
      <div className="overflow-x-auto">
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default React.memo(Chart);
