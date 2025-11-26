// src/components/DataItem.jsx
import React from 'react';
export default React.memo(function DataItem({ item }) {
  return (
    <div className="bg-white p-4 m-2 rounded shadow flex justify-between">
      <div>
        <div className="text-lg font-bold">{item.symbol}</div>
        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
      </div>
      <div>
        <div>Invested: {(item.purchasePrice * item.quantity).toFixed(2)}</div>
      </div>
    </div>
  );
});
