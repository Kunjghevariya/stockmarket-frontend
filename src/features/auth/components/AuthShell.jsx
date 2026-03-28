export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel relative overflow-hidden rounded-[2rem] p-8 text-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_24rem)]" />
          <div className="relative space-y-6">
            <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Made to feel calm and clear
            </span>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
                Keep track of your money without translating a dashboard in your head.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                StockFlow now welcomes you with clearer language, friendlier numbers, and a one-click demo account so
                you can explore safely before using your own data.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/70 p-4">
                <div className="text-sm text-slate-500">Start fast</div>
                <div className="mt-2 text-2xl font-semibold">Light pages</div>
              </div>
              <div className="rounded-3xl bg-white/70 p-4">
                <div className="text-sm text-slate-500">Stay private</div>
                <div className="mt-2 text-2xl font-semibold">Own data</div>
              </div>
              <div className="rounded-3xl bg-white/70 p-4">
                <div className="text-sm text-slate-500">Try safely</div>
                <div className="mt-2 text-2xl font-semibold">Live demo</div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-8 shadow-xl">
          <div className="mb-8 space-y-2">
            <h2 className="text-3xl font-semibold text-slate-950">{title}</h2>
            <p className="text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>

          <div className="space-y-6">{children}</div>

          {footer ? <div className="mt-8 text-sm text-slate-500">{footer}</div> : null}
        </section>
      </div>
    </div>
  );
}
