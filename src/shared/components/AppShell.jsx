import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/market', label: 'Market' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/news', label: 'News' },
];

function navClassName({ isActive }) {
  return [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-white hover:text-slate-900',
  ].join(' ');
}

export default function AppShell() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="glass-panel sticky top-4 z-20 rounded-[1.75rem] px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <Link to="/dashboard">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">StockFlow Pro</div>
                <div className="text-sm text-slate-500">A calmer home for your market routine</div>
              </Link>

              <nav className="flex flex-wrap gap-2">
                {navigation.map((item) => (
                  <NavLink key={item.to} className={navClassName} to={item.to}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-full bg-white/80 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{user?.fullName || user?.username}</div>
                <div className="text-xs text-slate-500">
                  {user?.email}
                  {user?.isDemo ? ' • Safe demo space' : ''}
                </div>
              </div>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                type="button"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
