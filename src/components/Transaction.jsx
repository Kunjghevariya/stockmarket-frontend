// src/components/Transaction.jsx
import React, { useState } from 'react';
import apiFetch from '../utils/api';
import { usePortfolioCtx } from '../context/PortfolioContext';

export default function Transaction() {
  const { fetchPortfolio } = usePortfolioCtx();

  const [form, setForm] = useState({
    symbol: '',
    quantity: 0,
    purchasePrice: 0,
  });

  const submitBuy = async () => {
    await apiFetch('/api/v1/portfolio/buy', {
      method: 'POST',
      body: form,
    });
    fetchPortfolio();
  };

  const submitSell = async () => {
    await apiFetch('/api/v1/portfolio/sell', {
      method: 'POST',
      body: form,
    });
    fetchPortfolio();
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Buy / Sell</h1>

      <input className="border p-2 rounded mb-3 w-full"
        placeholder="Symbol" 
        value={form.symbol}
        onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
      />

      <input className="border p-2 rounded mb-3 w-full"
        placeholder="Quantity" type="number"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
      />

      <input className="border p-2 rounded mb-3 w-full"
        placeholder="Purchase Price" type="number"
        value={form.purchasePrice}
        onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })}
      />

      <div className="flex gap-3">
        <button onClick={submitBuy} className="bg-green-600 text-white px-4 py-2 rounded">
          Buy
        </button>
        <button onClick={submitSell} className="bg-red-600 text-white px-4 py-2 rounded">
          Sell
        </button>
      </div>
    </div>
  );
}
