export default function SectionCard({ title, description, action, children, className = '' }) {
  return (
    <section className={`glass-panel rounded-[1.75rem] p-5 ${className}`.trim()}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">{title}</h2>
          {description ? <p className="section-copy mt-1">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
