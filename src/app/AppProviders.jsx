import { AuthProvider } from '../features/auth/AuthContext';
import { PortfolioProvider } from '../features/portfolio/PortfolioContext';
import { WatchlistProvider } from '../features/watchlist/WatchlistContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <PortfolioProvider>{children}</PortfolioProvider>
      </WatchlistProvider>
    </AuthProvider>
  );
}
