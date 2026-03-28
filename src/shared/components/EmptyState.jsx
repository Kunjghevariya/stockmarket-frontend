export default function EmptyState({ title, description, action }) {
  return (
    <div className="glass-panel rounded-[1.5rem] border border-dashed border-slate-200 p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
