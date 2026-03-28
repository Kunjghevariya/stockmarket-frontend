export default function PageLoader({ label = 'Loading', fullScreen = false }) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[12rem]'}`}
      aria-live="polite"
    >
      <div className="glass-panel flex items-center gap-3 rounded-full px-5 py-3 text-sm text-slate-600">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-teal-600" />
        <span>{label}</span>
      </div>
    </div>
  );
}
