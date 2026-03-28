import { useEffect, useMemo, useState } from 'react';
import { fetchTransactions } from '../api/transactionsApi';
import TransactionRow from '../components/TransactionRow';
import EmptyState from '../../../shared/components/EmptyState';
import PageLoader from '../../../shared/components/PageLoader';
import SectionCard from '../../../shared/components/SectionCard';
import VirtualList from '../../../shared/components/VirtualList';

const filterOptions = ['all', 'buy', 'sell'];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let ignore = false;

    const loadTransactions = async () => {
      setLoading(true);
      try {
        const payload = await fetchTransactions({
          pageSize: 250,
          type: filter,
        });

        if (!ignore) {
          setTransactions(Array.isArray(payload?.items) ? payload.items : []);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to load transactions', error);
          setTransactions([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      ignore = true;
    };
  }, [filter]);

  const shouldVirtualize = useMemo(() => transactions.length > 12, [transactions.length]);

  return (
    <SectionCard
      title="Transaction history"
      description="Longer histories now use list virtualization to avoid rerendering every row at once."
      action={
        <div className="flex gap-2 rounded-full bg-white/80 p-1">
          {filterOptions.map((option) => (
            <button
              key={option}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === option ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              type="button"
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      }
    >
      {loading ? (
        <PageLoader label="Loading transactions" />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="When you buy or sell a symbol, the account-specific audit trail will appear here."
        />
      ) : shouldVirtualize ? (
        <VirtualList
          items={transactions}
          height={560}
          itemHeight={96}
          getItemKey={(transaction) => transaction._id}
          renderItem={(transaction) => <TransactionRow transaction={transaction} />}
        />
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionRow key={transaction._id} transaction={transaction} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
