import { memo } from 'react';

const toneClasses = {
  neutral: 'bg-slate-950 text-white',
  success: 'bg-emerald-50 text-emerald-800',
  brand: 'bg-teal-50 text-teal-800',
};

function MetricCard({ label, value, hint, tone = 'neutral' }) {
  return (
    <div className={`rounded-[1.5rem] p-5 ${toneClasses[tone] || toneClasses.neutral}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">{label}</div>
      <div className="mt-4 text-3xl font-semibold">{value}</div>
      {hint ? <div className="mt-2 text-sm opacity-80">{hint}</div> : null}
    </div>
  );
}

export default memo(MetricCard);
