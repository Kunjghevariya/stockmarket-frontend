import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const proofPoints = [
  {
    title: 'One calm home for your investing habit',
    description: 'Watchlists, portfolio snapshots, news, and transactions live together instead of in five tabs.',
  },
  {
    title: 'A demo account you can touch without fear',
    description: 'One click creates a fresh demo workspace so you can test the product without mixing real data.',
  },
  {
    title: 'Human-readable numbers and timelines',
    description: 'Money, dates, gains, and trades are presented like a story, not a raw API response.',
  },
];

const featureRows = [
  {
    eyebrow: 'For everyday checking',
    title: 'See how your portfolio is doing in plain language.',
    description: 'From “money you put in” to “what it looks like now,” the dashboard now speaks like a product, not a schema.',
  },
  {
    eyebrow: 'For making decisions',
    title: 'Move from idea to trade without losing context.',
    description: 'Search a symbol, add it to your watchlist, read the chart, and place a buy or sell order from one flow.',
  },
  {
    eyebrow: 'For trust',
    title: 'Every account keeps its own watchlist, portfolio, and trade history.',
    description: 'No shared demo data leaks into real accounts, and every authenticated user sees only their own store of information.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { signInWithDemo } = useAuth();
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  const handleDemoLaunch = async () => {
    setIsCreatingDemo(true);

    try {
      await signInWithDemo();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to launch demo account', error);
      setIsCreatingDemo(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-5 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="glass-panel rounded-[2rem] px-5 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">StockFlow</div>
              <div className="mt-1 text-sm text-slate-500">A calmer way to follow your money and the market.</div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
                to="/signin"
              >
                Sign in
              </Link>
              <Link
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                to="/signup"
              >
                Create account
              </Link>
            </div>
          </div>
        </header>

        <section className="glass-panel overflow-hidden rounded-[2.5rem] px-6 py-10 md:px-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                Humanized investing workspace
              </span>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
                  Keep up with the market without feeling buried in dashboards.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                  StockFlow brings your watchlist, portfolio, trade history, and news into one place that feels warm,
                  readable, and fast. It is built for real people checking their positions between meetings, not just
                  developers checking API payloads.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                  onClick={handleDemoLaunch}
                  disabled={isCreatingDemo}
                >
                  {isCreatingDemo ? 'Preparing your demo workspace...' : 'Try the demo instantly'}
                </button>
                <Link
                  className="rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
                  to="/signup"
                >
                  Start with your own account
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {proofPoints.map((point) => (
                  <div key={point.title} className="rounded-[1.5rem] bg-white/80 p-4">
                    <div className="text-sm font-semibold text-slate-900">{point.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{point.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-8 hidden h-40 w-40 rounded-full bg-teal-200/40 blur-3xl lg:block" />
              <div className="absolute -right-6 bottom-6 hidden h-48 w-48 rounded-full bg-sky-200/40 blur-3xl lg:block" />
              <div className="relative grid gap-4">
                <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">How it feels</div>
                  <div className="mt-4 text-3xl font-semibold">“I can actually understand my portfolio at a glance.”</div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Friendlier copy, cleaner sections, faster route loading, and demo onboarding that feels safe to click.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-white/80 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Performance story</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-950">What changed this month</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Charts and trade history now read like a timeline instead of a spreadsheet dump.
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] bg-white/80 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Private data</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-950">Your account stays yours</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Watchlists, positions, and transactions stay scoped to the current user from the backend up.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {featureRows.map((item) => (
            <article key={item.title} className="glass-panel rounded-[2rem] p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">{item.eyebrow}</div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="glass-panel rounded-[2.25rem] px-6 py-8 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Ready when you are</div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-4xl">
              Start with a safe demo, then move into your own portfolio when you are comfortable.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              You do not have to guess what a button will do. The product now explains itself more clearly, and the
              data is presented in a way that feels grounded and approachable.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
