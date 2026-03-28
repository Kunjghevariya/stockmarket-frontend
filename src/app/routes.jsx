import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppShell from '../shared/components/AppShell';
import PageLoader from '../shared/components/PageLoader';
import { useAuth } from '../features/auth/AuthContext';

const SignInPage = lazy(() => import('../features/auth/pages/SignInPage'));
const SignUpPage = lazy(() => import('../features/auth/pages/SignUpPage'));
const LandingPage = lazy(() => import('../features/marketing/pages/LandingPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const MarketPage = lazy(() => import('../features/market/pages/MarketPage'));
const PortfolioPage = lazy(() => import('../features/portfolio/pages/PortfolioPage'));
const TransactionsPage = lazy(() => import('../features/transactions/pages/TransactionsPage'));
const NewsPage = lazy(() => import('../features/news/pages/NewsPage'));

function ProtectedRoute() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <PageLoader label="Checking your session" fullScreen />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <PageLoader label="Preparing your workspace" fullScreen />;
  }

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function RootRedirect() {
  const { status } = useAuth();
  if (status === 'loading') {
    return <PageLoader label="Preparing your workspace" fullScreen />;
  }
  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
