import { Suspense, lazy } from 'react';
import PageLoader from './PageLoader';

const LineChart = lazy(() => import('./LineChart'));

export default function AsyncLineChart(props) {
  return (
    <Suspense fallback={<PageLoader label="Loading chart" />}>
      <LineChart {...props} />
    </Suspense>
  );
}
