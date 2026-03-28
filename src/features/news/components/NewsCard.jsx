import { memo } from 'react';
import { formatDateTime, formatRelativeTime } from '../../../shared/utils/formatters';

function NewsCard({ article }) {
  return (
    <article className="glass-panel flex h-full flex-col overflow-hidden rounded-[1.5rem]">
      <div className="h-44 overflow-hidden bg-slate-100">
        {article.urlToImage ? (
          <img className="h-full w-full object-cover" src={article.urlToImage} alt={article.title} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No preview image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
          {article.source?.name || 'Market news'}
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-950">{article.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
          {article.description || 'This story does not include a short summary, so you may want to open it for the full context.'}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            {formatRelativeTime(article.publishedAt)} • {formatDateTime(article.publishedAt)}
          </span>
          <a
            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
            href={article.url}
            rel="noreferrer"
            target="_blank"
          >
            Read article
          </a>
        </div>
      </div>
    </article>
  );
}

export default memo(NewsCard);
