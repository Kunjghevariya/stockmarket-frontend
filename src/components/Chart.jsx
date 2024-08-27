import React, { useState, useEffect } from 'react';
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
import useportfolio from './ContextApi/portfolio';

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
  const [portfolio] = useportfolio();  
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (portfolio.statusCode && portfolio.statusCode.holdings) {
      const holdings = portfolio.statusCode.holdings;
      const labels = holdings.map(e => e.symbol);
      const data = holdings.map(e => e.purchasePrice);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Portfolio Holdings',
            data: data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });

      console.log("Labels:", labels);
      console.log("Data:", data);
      console.log("Holdings:", holdings);
      console.log("Total Investment:", portfolio.statusCode.totalInvestment);
    }
  }, [portfolio]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Portfolio Overview',
      },
    },
  };

  return (
    <div className='bg-white rounded-md shadow-md m-4 p-4 md:p-10'>
      <div className='overflow-x-auto'>
        {chartData ? <Line options={options} data={chartData} /> : <p>Loading chart...</p>}
      </div>
    </div>
  );
};

export default Chart;
