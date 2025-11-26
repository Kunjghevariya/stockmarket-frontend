import React from 'react';
import Search from './Search';

const Serchs = ({ results, setsybl }) => {
  return (
    <div className="bg-white border rounded-md shadow-md max-h-60 overflow-auto">
      {results.map((result, idx) => (
        <Search key={idx} result={result} setsybl={setsybl} />
      ))}
    </div>
  );
};

export default React.memo(Serchs);
