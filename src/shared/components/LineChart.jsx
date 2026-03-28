import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

function formatSeriesPoint(point) {
  if ('value' in point) {
    return point.value;
  }

  return point.close ?? point.price ?? 0;
}

function formatSeriesLabel(point) {
  const rawValue = point.timestamp || point.time;
  return new Date((rawValue < 10_000_000_000 ? rawValue * 1000 : rawValue) || Date.now()).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
    }
  );
}

function LineChart({ dataPoints, label, fill = false, yLabel = 'Price' }) {
  const chartData = useMemo(
    () => ({
      labels: dataPoints.map(formatSeriesLabel),
      datasets: [
        {
          label,
          data: dataPoints.map(formatSeriesPoint),
          borderColor: '#0f766e',
          backgroundColor: fill ? 'rgba(15, 118, 110, 0.14)' : 'rgba(15, 118, 110, 0.16)',
          tension: 0.28,
          fill,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    }),
    [dataPoints, fill, label]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#94a3b8',
          },
        },
        y: {
          ticks: {
            color: '#94a3b8',
          },
          title: {
            display: true,
            text: yLabel,
          },
        },
      },
    }),
    [yLabel]
  );

  return (
    <div className="h-[20rem]">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default memo(LineChart);
