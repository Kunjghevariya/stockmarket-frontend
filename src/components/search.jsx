import React from 'react';

const Search = ({ result, setsybl }) => {
  return (
    <div
      className="hover:bg-slate-200 px-3 py-2 cursor-pointer"
      onClick={() => setsybl(result.symbol)}
    >
      <div className="font-semibold">{result.shortname}</div>
      <div className="text-gray-700 text-sm">
        {result.symbol} | {result.exchange}
      </div>
    </div>
  );
};

export default Search;
