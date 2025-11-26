// src/pages/Portfolio.jsx
import React from 'react';
import { usePortfolioCtx } from '../context/PortfolioContext';
import DataItem from '../components/DataItem';

export default function Portfolio() {
  const { portfolio } = usePortfolioCtx();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Portfolio</h1>

      {portfolio.holdings.length === 0 ? (
        <p>No stocks in portfolio</p>
      ) : (
        portfolio.holdings.map((h) => <DataItem key={h.symbol} item={h} />)
      )}
    </div>
  );
}
