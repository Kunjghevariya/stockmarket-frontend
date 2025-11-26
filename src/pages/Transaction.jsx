import React from 'react';
import { usePortfolioCtx } from '../context/PortfolioContext';

const Transaction = () => {
  const { portfolio } = usePortfolioCtx();

  const holdings = portfolio?.statusCode?.holdings || [];

  return (
    <div className="p-4">

      {/* Profile Section */}
      <div className="flex profile bg-white rounded-md shadow-md p-4 mb-5 sm:block w-1/4">
        <div className="pic m-3 rounded-full overflow-hidden">
          <img
            src="src/assest/Profile Pic.jpg"
            alt="Profile"
            className="h-auto w-full"
          />
        </div>
        <div className="name text-center text-3xl">Kunj Ghevariya</div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="text-xl font-bold">Holdings</h2>
        {holdings.map((h) => (
          <div key={h._id} className="p-2 border-b">
            {h.symbol} — {h.quantity}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Transaction;
