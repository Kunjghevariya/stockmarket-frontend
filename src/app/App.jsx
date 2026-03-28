import { Suspense } from 'react';
import AppRoutes from './routes';
import PageLoader from '../shared/components/PageLoader';

export default function App() {
  return (
    <Suspense fallback={<PageLoader label="Loading application" fullScreen />}>
      <AppRoutes />
    </Suspense>
  );
}
