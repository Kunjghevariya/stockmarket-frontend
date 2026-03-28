import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '../../../shared/utils/formatters';

const EMPTY_FORM = {
  quantity: '1',
  price: '',
};

export default function TradeModal({ symbol, type, quote, isSubmitting, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const referencePrice = quote?.current ? String(quote.current) : '';

  useEffect(() => {
    if (!symbol) {
      setForm(EMPTY_FORM);
      return;
    }

    setForm({
      quantity: '1',
      price: referencePrice,
    });
  }, [referencePrice, symbol]);

  const totalValue = useMemo(() => {
    const quantity = Number(form.quantity || 0);
    const price = Number(form.price || 0);
    return quantity * price;
  }, [form.price, form.quantity]);

  if (!symbol || !type) {
    return null;
  }

  const isBuy = type === 'buy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="glass-panel w-full max-w-lg rounded-[2rem] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              {isBuy ? 'Getting ready to buy' : 'Getting ready to sell'}
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{symbol}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {quote?.current
                ? `The latest market reference we have is ${formatCurrency(quote.current)}.`
                : 'Live pricing is unavailable right now, so enter a price manually if needed.'}
            </p>
          </div>
          <button
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {isBuy ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Price per share</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => setForm((previous) => ({ ...previous, price: event.target.value }))}
              />
            </label>
          ) : null}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Quantity</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={(event) => setForm((previous) => ({ ...previous, quantity: event.target.value }))}
            />
          </label>

          <div className="rounded-[1.25rem] bg-slate-950 px-4 py-4 text-white">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-300">Estimated order value</div>
            <div className="mt-2 text-2xl font-semibold">{formatCurrency(totalValue)}</div>
          </div>

          <button
            className={`w-full rounded-2xl px-4 py-3 font-semibold text-white transition ${
              isBuy ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'
            } disabled:cursor-not-allowed disabled:opacity-60`}
            type="button"
            onClick={() =>
              onSubmit({
                quantity: Number(form.quantity),
                price: Number(form.price || quote?.current || 0),
              })
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving your order...' : isBuy ? 'Place buy order' : 'Place sell order'}
          </button>
        </div>
      </div>
    </div>
  );
}
