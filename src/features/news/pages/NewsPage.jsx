import { useEffect, useState } from 'react';
import { fetchNews } from '../../market/api/marketApi';
import NewsCard from '../components/NewsCard';
import EmptyState from '../../../shared/components/EmptyState';
import PageLoader from '../../../shared/components/PageLoader';
import SectionCard from '../../../shared/components/SectionCard';
import useDebouncedValue from '../../../shared/hooks/useDebouncedValue';
import { titleCase } from '../../../shared/utils/formatters';

const categories = ['business', 'technology', 'general'];

export default function NewsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('business');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    let ignore = false;

    const loadNews = async () => {
      setLoading(true);
      try {
        const payload = await fetchNews({
          q: debouncedQuery.trim(),
          category,
          pageSize: 18,
        });

        if (!ignore) {
          setArticles(Array.isArray(payload?.articles) ? payload.articles : []);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to fetch news', error);
          setArticles([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      ignore = true;
    };
  }, [category, debouncedQuery]);

  return (
    <div className="space-y-6">
      <SectionCard title="What the market is talking about" description="Headlines are easier to scan now, with softer copy and cleaner dates.">
        <div className="flex flex-col gap-4 lg:flex-row">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            placeholder="Search a company, topic, or sector you care about"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="flex gap-2 rounded-full bg-white/80 p-1">
            {categories.map((option) => (
              <button
                key={option}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  category === option ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                type="button"
                onClick={() => setCategory(option)}
              >
                {titleCase(option)}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {loading ? (
        <PageLoader label="Pulling in the latest stories" />
      ) : articles.length === 0 ? (
        <EmptyState
          title="No stories matched that search"
          description="Try something broader, or switch categories to see a wider view of the market."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article, index) => (
            <NewsCard key={`${article.url || article.title}-${index}`} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
